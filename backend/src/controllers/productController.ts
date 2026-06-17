import { Response } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/apiKeyAuth';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  listPrice: z.number().positive('List price must be positive'),
  floorPrice: z.number().positive('Floor price must be positive'),
  currency: z.string().length(3, 'Currency must be a 3-letter ISO code').default('USD'),
});

const updateProductSchema = productSchema.partial();

// Security: strip floorPrice from every outbound response
function sanitize(product: Record<string, unknown>) {
  const { floorPrice, ...safe } = product;
  void floorPrice;
  return safe;
}

async function assertOwnership(
  productId: string,
  merchantId: string,
  res: Response,
): Promise<Prisma.ProductGetPayload<object> | null> {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return null;
  }
  if (product.merchantId !== merchantId) {
    res.status(403).json({ error: 'Forbidden' });
    return null;
  }
  return product;
}

export async function listProducts(req: AuthenticatedRequest, res: Response): Promise<void> {
  const products = await prisma.product.findMany({
    where: { merchantId: req.merchant!.id, isActive: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(products.map(sanitize));
}

export async function getProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
  const product = await assertOwnership(req.params.id as string, req.merchant!.id, res);
  if (!product) return;
  res.json(sanitize(product as unknown as Record<string, unknown>));
}

export async function createProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = productSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten().fieldErrors });
    return;
  }

  const { listPrice, floorPrice, ...rest } = result.data;

  if (floorPrice > listPrice) {
    res.status(400).json({ error: 'floorPrice cannot exceed listPrice' });
    return;
  }

  const merchantId = req.merchant!.id;
  const product = await prisma.product.create({
    data: { ...rest, listPrice, floorPrice, merchantId },
  });

  res.status(201).json(sanitize(product as unknown as Record<string, unknown>));
}

export async function updateProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
  const existing = await assertOwnership(req.params.id as string, req.merchant!.id, res);
  if (!existing) return;

  const result = updateProductSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten().fieldErrors });
    return;
  }

  const { listPrice, floorPrice, ...rest } = result.data;

  const effectiveListPrice = listPrice ?? Number(existing.listPrice);
  const effectiveFloorPrice = floorPrice ?? Number(existing.floorPrice);

  if (effectiveFloorPrice > effectiveListPrice) {
    res.status(400).json({ error: 'floorPrice cannot exceed listPrice' });
    return;
  }

  const product = await prisma.product.update({
    where: { id: req.params.id as string },
    data: {
      ...rest,
      ...(listPrice !== undefined && { listPrice }),
      ...(floorPrice !== undefined && { floorPrice }),
    },
  });

  res.json(sanitize(product as unknown as Record<string, unknown>));
}

export async function deleteProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
  const existing = await assertOwnership(req.params.id as string, req.merchant!.id, res);
  if (!existing) return;

  // Soft delete — preserves session history
  await prisma.product.update({
    where: { id: req.params.id as string },
    data: { isActive: false },
  });

  res.status(204).send();
}

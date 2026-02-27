import { PortfolioItem, Order } from '../types';

const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function parseFirestoreValue(val: any): any {
  if (val.stringValue !== undefined) return val.stringValue;
  if (val.integerValue !== undefined) return Number(val.integerValue);
  if (val.doubleValue !== undefined) return val.doubleValue;
  if (val.booleanValue !== undefined) return val.booleanValue;
  if (val.timestampValue !== undefined) return val.timestampValue;
  if (val.nullValue !== undefined) return null;
  if (val.arrayValue) {
    return (val.arrayValue.values || []).map(parseFirestoreValue);
  }
  if (val.mapValue) {
    const result: any = {};
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
      result[k] = parseFirestoreValue(v);
    }
    return result;
  }
  return null;
}

function parseFirestoreDoc(doc: any): any {
  const fields = doc.fields || {};
  const parsed: any = {};
  for (const [key, val] of Object.entries(fields)) {
    parsed[key] = parseFirestoreValue(val as any);
  }
  parsed.id = doc.name.split('/').pop();
  return parsed;
}

function toFirestoreValue(val: any): any {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return { integerValue: String(val) };
    return { doubleValue: val };
  }
  if (typeof val === 'boolean') return { booleanValue: val };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === 'object') {
    const fields: any = {};
    for (const [k, v] of Object.entries(val)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function toFirestoreFields(data: Record<string, any>): Record<string, any> {
  const fields: any = {};
  for (const [key, val] of Object.entries(data)) {
    if (key === 'id') continue;
    fields[key] = toFirestoreValue(val);
  }
  return fields;
}

async function apiRequest(path: string, method: string = 'GET', body?: any): Promise<any> {
  const url = `${BASE_URL}${path}${path.includes('?') ? '&' : '?'}key=${API_KEY}`;
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore API error (${res.status}): ${text}`);
  }
  if (method === 'DELETE') return null;
  return res.json();
}

export async function getPortfolios(): Promise<PortfolioItem[]> {
  const data = await apiRequest('/portfolios?pageSize=500');
  const docs = data.documents || [];
  const items = docs.map(parseFirestoreDoc) as PortfolioItem[];
  items.sort((a: any, b: any) => {
    const aTime = a.createdAt || '';
    const bTime = b.createdAt || '';
    return bTime > aTime ? 1 : bTime < aTime ? -1 : 0;
  });
  return items;
}

export async function addPortfolio(item: Omit<PortfolioItem, 'id'>): Promise<string> {
  const fields = toFirestoreFields({
    ...item,
    createdAt: new Date().toISOString(),
    visible: true,
  });
  const data = await apiRequest('/portfolios', 'POST', { fields });
  return data.name.split('/').pop();
}

export async function updatePortfolio(id: string, updates: Partial<PortfolioItem>): Promise<void> {
  const existing = await apiRequest(`/portfolios/${id}`);
  const currentFields = existing.fields || {};
  const updateFields = toFirestoreFields(updates);
  const mergedFields = { ...currentFields, ...updateFields };
  await apiRequest(`/portfolios/${id}`, 'PATCH', { fields: mergedFields });
}

export async function deletePortfolio(id: string): Promise<void> {
  await apiRequest(`/portfolios/${id}`, 'DELETE');
}

export async function togglePortfolioVisibility(id: string, visible: boolean): Promise<void> {
  await updatePortfolio(id, { visible } as any);
}

export async function getOrders(): Promise<Order[]> {
  const data = await apiRequest('/orders?pageSize=500');
  const docs = data.documents || [];
  const items = docs.map(parseFirestoreDoc) as Order[];
  items.sort((a: any, b: any) => {
    const aDate = a.date || '';
    const bDate = b.date || '';
    return bDate > aDate ? 1 : bDate < aDate ? -1 : 0;
  });
  return items;
}

export async function addOrder(order: Omit<Order, 'id'>): Promise<string> {
  const fields = toFirestoreFields({
    ...order,
    createdAt: new Date().toISOString(),
  });
  const data = await apiRequest('/orders', 'POST', { fields });
  return data.name.split('/').pop();
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
  const existing = await apiRequest(`/orders/${id}`);
  const currentFields = existing.fields || {};
  const updateFields = toFirestoreFields({ status });
  const mergedFields = { ...currentFields, ...updateFields };
  await apiRequest(`/orders/${id}`, 'PATCH', { fields: mergedFields });
}

export async function deleteOrder(id: string): Promise<void> {
  await apiRequest(`/orders/${id}`, 'DELETE');
}

// Utility: parse "DD/MM/YYYY" into "YYYY-MM-DD"
function parseDMYToISO(dmy) {
  if (!dmy || typeof dmy !== 'string') return null;
  const m = dmy.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const [, d, mth, y] = m;
  const dd = d.padStart(2, '0');
  const mm = mth.padStart(2, '0');

  const dayNum = Number(dd);
  const monthNum = Number(mm);
  if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) return null;

  return `${y}-${mm}-${dd}`; // normalized YYYY-MM-DD
}

// Pick the event date key for an order.
// By default, use date_in; fallback to loading_date if date_in is missing.
// Set preferLoadingDate=true if you want to prioritize loading_date instead.
function getOrderDateKey(order, preferLoadingDate = false) {
  if (preferLoadingDate) {
    const loading = order?.loading_date
      ? parseDMYToISO(order.loading_date)
      : null;
    if (loading) return loading;
    const dateIn = order?.date_in ? parseDMYToISO(order.date_in) : null;
    return dateIn;
  } else {
    const dateIn = order?.date_in ? parseDMYToISO(order.date_in) : null;
    if (dateIn) return dateIn;
    const loading = order?.loading_date
      ? parseDMYToISO(order.loading_date)
      : null;
    return loading;
  }
}

// Compute supplier with best return rate, per your rules:
// - Unique clients counted per supplier.
// - A client "has returned" if they have orders on >= 2 distinct dates (based on date_in by default).
function supplierWithBestReturnRate(
  orders,
  { preferLoadingDate = false } = {}
) {
  // Map: supplier_phone_number -> Map(client_id -> Set(dateKeys))
  const supplierClientDates = new Map();

  for (const o of orders || []) {
    const supplier = o?.supplier_phone_number;
    const client = o?.client_id;
    if (!supplier || !client) continue;

    const dateKey = getOrderDateKey(o, preferLoadingDate);

    if (!supplierClientDates.has(supplier))
      supplierClientDates.set(supplier, new Map());
    const clientMap = supplierClientDates.get(supplier);
    if (!clientMap.has(client)) clientMap.set(client, new Set());
    if (dateKey) clientMap.get(client).add(dateKey);
  }

  let bestSupplier = null;
  let bestUnique = 0;
  let bestReturning = 0;
  let bestRate = 0;

  for (const [supplier, clientMap] of supplierClientDates.entries()) {
    const uniqueClients = clientMap.size;
    if (uniqueClients === 0) continue;

    let returningClients = 0;
    for (const dates of clientMap.values()) {
      if (dates.size >= 2) returningClients += 1;
    }

    const rate = returningClients / uniqueClients;

    // Choose highest rate; break ties by returningClients, then uniqueClients
    if (
      rate > bestRate ||
      (rate === bestRate &&
        (returningClients > bestReturning ||
          (returningClients === bestReturning && uniqueClients > bestUnique)))
    ) {
      bestSupplier = supplier;
      bestUnique = uniqueClients;
      bestReturning = returningClients;
      bestRate = rate;
    }
  }

  return {
    supplierPhone: bestSupplier,
    uniqueClients: bestUnique,
    returningClients: bestReturning,
    rate: bestRate, // 0..1
    ratePercent: Number((bestRate * 100).toFixed(2)) // e.g., 50 for 50%
  };
}

// Example usage with your sample data:
const orders = [
  {
    client_id: '939',
    ready_to_load: '',
    loading_date: '03/10/2024',
    container_number: 'CAAU9317314',
    invoice_number: '8066',
    date_in: '16/09/2024',
    origin_warehouse: 'Guangzhou',
    sales_person: '',
    LCL_FCL: 'LCL',
    marks: '',
    client_name: 'CHISHUGI',
    client_phone_number: '243840183133',
    tin_number: '',
    destination: 'Bukavu',
    goods_type: "Children's jeans",
    packages: '8',
    CBM: '1.83',
    weight: '539',
    supplier_name: 'AFLG24-1341-1',
    supplier_phone_number: '13802546731',
    brand: 'A',
    off_loading_fee: '',
    mark: ''
  },
  {
    client_id: '939',
    ready_to_load: '',
    loading_date: '03/10/2024',
    container_number: 'CAAU9317314',
    invoice_number: '2115',
    date_in: '25/09/2024',
    origin_warehouse: 'Guangzhou',
    sales_person: '',
    LCL_FCL: 'LCL',
    marks: '',
    client_name: 'CHISHUGI',
    client_phone_number: '243840183133',
    tin_number: '',
    destination: 'Bukavu',
    goods_type: 'jeans',
    packages: '4',
    CBM: '1.58',
    weight: '562',
    supplier_name: 'AFLG24-1341-1',
    supplier_phone_number: '13802546731',
    brand: 'A',
    off_loading_fee: '',
    mark: ''
  },
  {
    client_id: '939',
    ready_to_load: '',
    loading_date: '03/10/2024',
    container_number: 'CAAU9317314',
    invoice_number: '2115',
    date_in: '5/09/2024',
    origin_warehouse: 'Guangzhou',
    sales_person: '',
    LCL_FCL: 'LCL',
    marks: '',
    client_name: 'CHISHUGI',
    client_phone_number: '243840183133',
    tin_number: '',
    destination: 'Bukavu',
    goods_type: 'jeans',
    packages: '4',
    CBM: '1.58',
    weight: '562',
    supplier_name: 'AFLG24-1341-1',
    supplier_phone_number: '13802546731',
    brand: 'A',
    off_loading_fee: '',
    mark: ''
  },
  {
    client_id: '1014',
    ready_to_load: '',
    loading_date: '03/09/2025',
    container_number: 'CAAU9317314',
    invoice_number: '2115',
    date_in: '25/08/2024',
    origin_warehouse: 'Guangzhou',
    sales_person: '',
    LCL_FCL: 'LCL',
    marks: '',
    client_name: 'CHISHUGI',
    client_phone_number: '243840183133',
    tin_number: '',
    destination: 'Bukavu',
    goods_type: 'jeans',
    packages: '4',
    CBM: '1.58',
    weight: '562',
    supplier_name: 'AFLG24-1341-1',
    supplier_phone_number: '13802546731',
    brand: 'A',
    off_loading_fee: '',
    mark: ''
  },
  {
    client_id: '1014',
    ready_to_load: '',
    loading_date: '03/09/2025',
    container_number: 'CAAU9317314',
    invoice_number: '2115',
    date_in: '25/09/2024',
    origin_warehouse: 'Guangzhou',
    sales_person: '',
    LCL_FCL: 'LCL',
    marks: '',
    client_name: 'CHISHUGI',
    client_phone_number: '243840183133',
    tin_number: '',
    destination: 'Bukavu',
    goods_type: 'jeans',
    packages: '4',
    CBM: '1.58',
    weight: '562',
    supplier_name: 'AFLG24-1341-1',
    supplier_phone_number: '13802546731',
    brand: 'A',
    off_loading_fee: '',
    mark: ''
  },
  {
    client_id: '1014',
    ready_to_load: '',
    loading_date: '06/09/2024',
    container_number: 'CAAU9317314',
    invoice_number: '2115',
    date_in: '25/09/2024',
    origin_warehouse: 'Guangzhou',
    sales_person: '',
    LCL_FCL: 'LCL',
    marks: '',
    client_name: 'CHISHUGI',
    client_phone_number: '243840183133',
    tin_number: '',
    destination: 'Bukavu',
    goods_type: 'jeans',
    packages: '4',
    CBM: '1.58',
    weight: '562',
    supplier_name: 'AFLG24-1341-1',
    supplier_phone_number: '13802546731',
    brand: 'A',
    off_loading_fee: '',
    mark: ''
  },
  {
    client_id: '114',
    ready_to_load: '',
    loading_date: '06/09/2024',
    container_number: 'CAAU9317314',
    invoice_number: '2115',
    date_in: '25/09/2024',
    origin_warehouse: 'Guangzhou',
    sales_person: '',
    LCL_FCL: 'LCL',
    marks: '',
    client_name: 'CHISHUGI',
    client_phone_number: '243840183133',
    tin_number: '',
    destination: 'Bukavu',
    goods_type: 'jeans',
    packages: '4',
    CBM: '1.58',
    weight: '562',
    supplier_name: 'AFLG265432',
    supplier_phone_number: '13804567876',
    brand: 'A',
    off_loading_fee: '',
    mark: ''
  }
];

const best = supplierWithBestReturnRate(orders);
// Expected for this sample: supplier 13802546731, uniqueClients=2, returningClients=1, rate=0.5
console.log(best);
console.log(`Best supplier return rate: ${best.ratePercent}%`);

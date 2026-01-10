export function computeSupplierReturnStats(orders) {
  const suppliers = new Map();

  for (const o of Array.isArray(orders) ? orders : []) {
    const phone = (o.supplier_phone_number || '').trim();
    if (!phone) continue; // skip if supplier phone is missing

    const name = (o.supplier_name || '').trim();

    let agg = suppliers.get(phone);
    if (!agg) {
      agg = {
        supplier_phone_number: phone,
        supplier_name: name || null,
        total_order: 0,
        clientDates: new Map() // client_id -> Set(date_in)
      };
      suppliers.set(phone, agg);
    } else if (!agg.supplier_name && name) {
      agg.supplier_name = name;
    }

    agg.total_order += 1;

    const clientId = (o.client_id || '').trim();
    const dateIn = (o.date_in || '').trim();
    if (clientId) {
      let dates = agg.clientDates.get(clientId);
      if (!dates) {
        dates = new Set();
        agg.clientDates.set(clientId, dates);
      }
      if (dateIn) {
        dates.add(dateIn);
      }
    }
  }

  const result = [];
  for (const agg of suppliers.values()) {
    const totalClients = agg.clientDates.size;
    let returnClients = 0;
    for (const dates of agg.clientDates.values()) {
      if (dates.size >= 2) returnClients += 1;
    }
    const ratio = totalClients > 0 ? (returnClients / totalClients) * 100 : 0;

    result.push({
      supplier_name: agg.supplier_name || null,
      supplier_phone_number: agg.supplier_phone_number,
      return_ratio: ratio.toFixed(2) + '%',
      total_order: agg.total_order,
      total_clients: totalClients,
      return_clients: returnClients
    });
  }

  // Sort: highest return ratio first, then by return_clients, then total_clients, then name
  result.sort((a, b) => {
    const rb = parseFloat(b.return_ratio);
    const ra = parseFloat(a.return_ratio);
    if (rb !== ra) return rb - ra;
    if (b.return_clients !== a.return_clients)
      return b.return_clients - a.return_clients;
    if (b.total_clients !== a.total_clients)
      return b.total_clients - a.total_clients;
    return (a.supplier_name || '').localeCompare(b.supplier_name || '');
  });

  return result;
}

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
    supplier_name: 'ABC',
    supplier_phone_number: '12345',
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
    date_in: '16/09/2024',
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
    supplier_name: 'ABC',
    supplier_phone_number: '12345',
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
    date_in: '26/09/2024',
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
    supplier_name: 'ABC',
    supplier_phone_number: '12345',
    brand: 'A',
    off_loading_fee: '',
    mark: ''
  },
  {
    client_id: '250',
    ready_to_load: '',
    loading_date: '30/1/2025',
    container_number: 'CAAU9317314',
    invoice_number: '2115',
    date_in: '26/09/2024',
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
    supplier_name: 'ABC',
    supplier_phone_number: '12345',
    brand: 'A',
    off_loading_fee: '',
    mark: ''
  },
  {
    client_id: '939',
    ready_to_load: '',
    loading_date: '30/1/2025',
    container_number: 'CAAU9317314',
    invoice_number: '2115',
    date_in: '26/09/2024',
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
    supplier_name: 'XYZ',
    supplier_phone_number: '23456',
    brand: 'A',
    off_loading_fee: '',
    mark: ''
  },
  {
    client_id: '939',
    ready_to_load: '',
    loading_date: '30/1/2025',
    container_number: 'CAAU9317314',
    invoice_number: '2115',
    date_in: '26/09/2024',
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
    supplier_name: 'XYZ',
    supplier_phone_number: '23456',
    brand: 'A',
    off_loading_fee: '',
    mark: ''
  },
  {
    client_id: '1014',
    ready_to_load: '',
    loading_date: '30/1/2025',
    container_number: 'CAAU9317314',
    invoice_number: '2115',
    date_in: '26/09/2024',
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
    supplier_name: 'ABC',
    supplier_phone_number: '12345',
    brand: 'A',
    off_loading_fee: '',
    mark: ''
  },
  {
    client_id: '1014',
    ready_to_load: '',
    loading_date: '30/1/2025',
    container_number: 'CAAU9317314',
    invoice_number: '2115',
    date_in: '26/06/2025',
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
    supplier_name: 'XYZ',
    supplier_phone_number: '23456',
    brand: 'A',
    off_loading_fee: '',
    mark: ''
  },
  {
    client_id: '1014',
    ready_to_load: '',
    loading_date: '30/1/2025',
    container_number: 'CAAU9317314',
    invoice_number: '2115',
    date_in: '26/06/2025',
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
    supplier_name: 'XYZ',
    supplier_phone_number: '23456',
    brand: 'A',
    off_loading_fee: '',
    mark: ''
  },
  {
    client_id: '1014',
    ready_to_load: '',
    loading_date: '30/1/2025',
    container_number: 'CAAU9317314',
    invoice_number: '2115',
    date_in: '26/07/2025',
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
    supplier_name: 'XYZ',
    supplier_phone_number: '23456',
    brand: 'A',
    off_loading_fee: '',
    mark: ''
  }
];

console.log(computeSupplierReturnStats(orders));

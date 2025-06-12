I am working on a dashboard for visualizing trade Goma China trade data. The data is a long list of orders made by clients from goma to suppliers form China in a json file. Here is how the data is structured:
{
    "client_id": "632",
    "ready_to_load": "",
    "loading_date": "25/04/2025",
    "container_number": "TGBU9695820",
    "invoice_number": "8953",
    "date_in": "22/04/2025",
    "origin_warehouse": "Guangzhou",
    "sales_person": "",
    "LCL_FCL": "LCL",
    "marks": "",
    "client_name": "KETIA",
    "client_phone_number": "243992333831",
    "tin_number": "",
    "destination": "Goma",
    "goods_type": "jeans",
    "packages": "4",
    "CBM": "1.13",
    "weight": "397",
    "supplier_name": "美泰城B1035",
    "supplier_phone_number": "13533307772",
    "brand": "A",
    "off_loading_fee": "",
    "mark": ""
  }
Here is a hook for data fetching:
// this is ahook for fetching order data from a local JSON file or remote URL
import { useQuery } from '@tanstack/react-query';

// Replace with your local path or remote URL
// const DATA_URL = import.meta.env.VITE_DATA_URL;

Now this is my template of a page dedicated to insight about suppliers and their reliability: 
// pages/suppliers/index.tsx

- I want to create a card component that will be reused for the three small cards
- and put the searchable table in a component of its own

tell me you understand, and you are ready to work on the components, I will tell you what I want in each of the component you ready?

Before any of the data and logic, lets add some things to the page to make it a bit richer, my idea is to add at the top of the overview:
1 - An autofill dropdown of all the suppliers so that a suppliers can be chosen and all the data on the page will depend on that choice (put random supplier as default so it will change every time)
2 -  a profile card with an Avatar , supplier name, supplier phone number, goods type 

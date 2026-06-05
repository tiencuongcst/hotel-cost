# Hotel Cost Controller Hub

## Project Information

Project Name:
Hotel Cost Controller Hub

Frontend:

* Next.js 16 App Router
* TypeScript
* TailwindCSS

Backend:

* Supabase PostgreSQL

Database:
hotel_cost_warehouse

---

## Data Sync Status

Google Sheets → Supabase

Completed

Tables:

* data_hotelinfo
* data_warehouse
* data_guests
* data_erp
* sync_logs

---

## Sync Logic

### ERP

Sync Mode:
UPSERT

Unique Key:

used_month,
hotel_code,
warehouse_code,
item_code

---

### Other Tables

Sync Mode:
REPLACE TABLE

Tables:

* data_hotelinfo
* data_warehouse
* data_guests

---

## Materialized Views

Created:

* mv_overview
* mv_cost_trend
* mv_guest_efficiency
* mv_cost_driver

---

## RPC Functions

Created:

* rpc_get_overview

Status:

Working

---

## Global Filters

All modules must support:

* used_month
* hotel_code
* warehouse_code

Guest Method:

* total_guests
* equivalent_guests

---

## Dashboard Modules

1. Overview

2. Cost Trend

3. Consumption Trend

4. Guest Efficiency

5. Cost Drivers

6. Alerts

---

## Current Milestone

Completed:

* Next.js Project Created
* Supabase Connected
* RPC Connected
* Overview Test Page Working

---

## Next Milestone

1. Review project structure

2. Remove duplicate folders

Current issue:

Both structures exist:

app/
services/
types/
lib/

and

src/app/
src/services/
src/types/
src/lib/

Need to standardize.

Recommended:

Use only:

src/

---

## Future Tasks

Overview V1

* Sidebar
* Header
* Global Filters
* KPI Cards
* Warehouse Cost Chart
* Top Items Chart
* Detail Table

Cost Trend

Consumption Trend

Guest Efficiency

Cost Drivers

Alerts

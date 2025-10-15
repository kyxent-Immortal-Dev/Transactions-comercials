/*
  Warnings:

  - You are about to drop the column `company` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `contactName` on the `suppliers` table. All the data in the column will be lost.
  - Added the required column `modified_at` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "code" VARCHAR(50),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" VARCHAR(100),
ADD COLUMN     "modified_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "modified_by" VARCHAR(100),
ADD COLUMN     "presentation" TEXT,
ADD COLUMN     "purchase_unit" VARCHAR(20),
ADD COLUMN     "sale_unit" VARCHAR(20),
ADD COLUMN     "size" VARCHAR(50),
ADD COLUMN     "uuid" VARCHAR(50),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "public"."suppliers" DROP COLUMN "company",
DROP COLUMN "contactName",
ADD COLUMN     "country" VARCHAR(100);

-- CreateTable
CREATE TABLE "public"."supplier_contacts" (
    "id" SERIAL NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "name" VARCHAR(100),
    "lastname" VARCHAR(100),
    "phone" VARCHAR(20),
    "email" TEXT,

    CONSTRAINT "supplier_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."units" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50),
    "type" VARCHAR(50),

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quotes" (
    "id" SERIAL NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" VARCHAR(50),
    "status" VARCHAR(20) DEFAULT 'pending',

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quote_details" (
    "id" SERIAL NOT NULL,
    "quote_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity_req" INTEGER,
    "price" DOUBLE PRECISION,
    "unit" VARCHAR(20),
    "quantity_approved" INTEGER,
    "status" VARCHAR(20) DEFAULT 'pending',

    CONSTRAINT "quote_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."buy_orders" (
    "id" SERIAL NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "quote_id" INTEGER,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code" VARCHAR(50),
    "status" VARCHAR(20) DEFAULT 'pending',
    "date_arrival" TIMESTAMP(3),

    CONSTRAINT "buy_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."buy_order_details" (
    "id" SERIAL NOT NULL,
    "buy_order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER,
    "price" DOUBLE PRECISION,
    "unit" VARCHAR(20),
    "status" VARCHAR(20) DEFAULT 'pending',

    CONSTRAINT "buy_order_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_log" (
    "id" SERIAL NOT NULL,
    "buy_order_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "item" VARCHAR(150) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "expense_type" VARCHAR(50) NOT NULL,

    CONSTRAINT "order_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."purchase" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "status" VARCHAR(50),
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "num_invoice" VARCHAR(100),
    "buy_order_id" INTEGER NOT NULL,
    "supplier_id" INTEGER NOT NULL,

    CONSTRAINT "purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."purchase_details" (
    "id" SERIAL NOT NULL,
    "purchase_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER,
    "price" DOUBLE PRECISION,
    "unit" VARCHAR(20),
    "status" VARCHAR(50),

    CONSTRAINT "purchase_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."retaceo" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "num_invoice" VARCHAR(100),
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(50),
    "purchase_id" INTEGER NOT NULL,

    CONSTRAINT "retaceo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."retaceo_details" (
    "id" SERIAL NOT NULL,
    "retaceo_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER,
    "price" DOUBLE PRECISION,
    "status" VARCHAR(50),

    CONSTRAINT "retaceo_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."price_analysis" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "status" VARCHAR(50),
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "num_invoice" VARCHAR(100),
    "retaceo_id" INTEGER NOT NULL,

    CONSTRAINT "price_analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."price_analysis_details" (
    "id" SERIAL NOT NULL,
    "price_analysis_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER,
    "price" DOUBLE PRECISION,
    "utility_percent" DOUBLE PRECISION,

    CONSTRAINT "price_analysis_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."price" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "bill_cost" DOUBLE PRECISION,
    "final_bill_retaceo" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "utility" DOUBLE PRECISION,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."price_history" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "price_analysis_id" INTEGER,
    "bill_cost" DOUBLE PRECISION,
    "final_bill_retaceo" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "utility" DOUBLE PRECISION,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(50),

    CONSTRAINT "price_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."expense_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "is_required" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "expense_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "expense_types_name_key" ON "public"."expense_types"("name");

-- AddForeignKey
ALTER TABLE "public"."supplier_contacts" ADD CONSTRAINT "supplier_contacts_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quotes" ADD CONSTRAINT "quotes_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quote_details" ADD CONSTRAINT "quote_details_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quote_details" ADD CONSTRAINT "quote_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."buy_orders" ADD CONSTRAINT "buy_orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."buy_orders" ADD CONSTRAINT "buy_orders_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."buy_order_details" ADD CONSTRAINT "buy_order_details_buy_order_id_fkey" FOREIGN KEY ("buy_order_id") REFERENCES "public"."buy_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."buy_order_details" ADD CONSTRAINT "buy_order_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_log" ADD CONSTRAINT "order_log_buy_order_id_fkey" FOREIGN KEY ("buy_order_id") REFERENCES "public"."buy_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."purchase" ADD CONSTRAINT "purchase_buy_order_id_fkey" FOREIGN KEY ("buy_order_id") REFERENCES "public"."buy_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."purchase" ADD CONSTRAINT "purchase_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."purchase_details" ADD CONSTRAINT "purchase_details_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "public"."purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."purchase_details" ADD CONSTRAINT "purchase_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."retaceo" ADD CONSTRAINT "retaceo_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "public"."purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."retaceo_details" ADD CONSTRAINT "retaceo_details_retaceo_id_fkey" FOREIGN KEY ("retaceo_id") REFERENCES "public"."retaceo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."retaceo_details" ADD CONSTRAINT "retaceo_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."price_analysis" ADD CONSTRAINT "price_analysis_retaceo_id_fkey" FOREIGN KEY ("retaceo_id") REFERENCES "public"."retaceo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."price_analysis_details" ADD CONSTRAINT "price_analysis_details_price_analysis_id_fkey" FOREIGN KEY ("price_analysis_id") REFERENCES "public"."price_analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."price_analysis_details" ADD CONSTRAINT "price_analysis_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."price" ADD CONSTRAINT "price_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."price_history" ADD CONSTRAINT "price_history_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."price_history" ADD CONSTRAINT "price_history_price_analysis_id_fkey" FOREIGN KEY ("price_analysis_id") REFERENCES "public"."price_analysis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

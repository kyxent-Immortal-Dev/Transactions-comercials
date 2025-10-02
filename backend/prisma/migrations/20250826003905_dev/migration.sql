-- CreateTable
CREATE TABLE "public"."categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "description" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50),
    "price" DOUBLE PRECISION,
    "description" TEXT,
    "image" TEXT,
    "amount" INTEGER,
    "subcategoriesid" INTEGER,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subcategories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "description" TEXT,
    "categoryid" INTEGER,

    CONSTRAINT "subcategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounts" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "lastname" VARCHAR(100),
    "email" TEXT,
    "password" TEXT,
    "image" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_subcategoriesid_fkey" FOREIGN KEY ("subcategoriesid") REFERENCES "public"."subcategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subcategories" ADD CONSTRAINT "subcategories_categoryid_fkey" FOREIGN KEY ("categoryid") REFERENCES "public"."categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

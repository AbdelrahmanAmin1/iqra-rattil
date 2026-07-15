-- Preserve the Book price column for historical compatibility, but make every
-- catalog entry free and introduce the database-owned catalog order.
ALTER TABLE "Book"
  ADD COLUMN "displayOrder" INTEGER NOT NULL DEFAULT 0,
  ALTER COLUMN "price" SET DEFAULT 0;

CREATE INDEX "Book_displayOrder_idx" ON "Book"("displayOrder");

-- Map the existing seeded records to the canonical eight-book catalog without
-- losing the already uploaded Tajweed cover.
UPDATE "Book" SET "code" = '__iqra_catalog_1__' WHERE "code" = 'b3';
UPDATE "Book" SET "code" = '__iqra_catalog_2__' WHERE "code" = 'b4';
UPDATE "Book" SET "code" = '__iqra_catalog_3__' WHERE "code" = 'b1';
UPDATE "Book" SET "code" = '__iqra_catalog_4__' WHERE "code" = 'b5';
UPDATE "Book" SET "code" = '__iqra_catalog_5__' WHERE "code" = 'b2';
UPDATE "Book" SET "code" = '__iqra_catalog_6__' WHERE "code" = 'b6';
UPDATE "Book" SET "code" = '__iqra_catalog_7__' WHERE "code" = 'b7';
UPDATE "Book"
SET "code" = '__iqra_catalog_8__'
WHERE "title" = 'التجويد الميسر'
  AND "code" NOT LIKE '__iqra_catalog_%';

UPDATE "Book" SET
  "code" = 'b1', "title" = 'دفتر حروف الهجاء', "subtitle" = NULL,
  "level" = 'المستوى التمهيدي ١', "soon" = false, "price" = 0,
  "displayOrder" = 1, "filePath" = NULL, "externalUrl" = NULL
WHERE "code" = '__iqra_catalog_1__';

UPDATE "Book" SET
  "code" = 'b2', "title" = 'دفتر حروف الهجاء وأشكالها', "subtitle" = NULL,
  "level" = 'المستوى التمهيدي ٢', "soon" = false, "price" = 0,
  "displayOrder" = 2, "filePath" = NULL, "externalUrl" = NULL
WHERE "code" = '__iqra_catalog_2__';

UPDATE "Book" SET
  "code" = 'b3', "title" = 'كتاب المستوى الأول', "subtitle" = NULL,
  "level" = 'المستوى الأول', "soon" = false, "price" = 0,
  "displayOrder" = 3
WHERE "code" = '__iqra_catalog_3__';

UPDATE "Book" SET
  "code" = 'b4', "title" = 'أوراق عمل المستوى الأول', "subtitle" = NULL,
  "level" = 'المستوى الأول', "soon" = false, "price" = 0,
  "displayOrder" = 4
WHERE "code" = '__iqra_catalog_4__';

UPDATE "Book" SET
  "code" = 'b5', "title" = 'المستوى الثاني', "subtitle" = NULL,
  "level" = 'المستوى الثاني', "soon" = false, "price" = 0,
  "displayOrder" = 5
WHERE "code" = '__iqra_catalog_5__';

UPDATE "Book" SET
  "code" = 'b6', "title" = 'أوراق عمل المستوى الثاني', "subtitle" = NULL,
  "level" = 'المستوى الثاني', "soon" = false, "price" = 0,
  "displayOrder" = 6
WHERE "code" = '__iqra_catalog_6__';

UPDATE "Book" SET
  "code" = 'b7', "title" = 'دليل المعلم', "subtitle" = NULL,
  "level" = 'للمعلم', "soon" = false, "price" = 0,
  "displayOrder" = 7
WHERE "code" = '__iqra_catalog_7__';

UPDATE "Book" SET
  "code" = 'b8', "title" = 'التجويد الميسر', "subtitle" = 'تحت الطبع',
  "level" = NULL, "soon" = true, "price" = 0,
  "displayOrder" = 8, "coverPath" = '/uploads/catalog-tajweed.jfif',
  "filePath" = NULL, "externalUrl" = NULL
WHERE "code" = '__iqra_catalog_8__';

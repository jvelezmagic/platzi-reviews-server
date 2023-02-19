-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "course";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "review";

-- CreateEnum
CREATE TYPE "course"."course_levels" AS ENUM ('BASICO', 'INTERMEDIO', 'AVANZADO');

-- CreateTable
CREATE TABLE "public"."example" (
    "id" SERIAL NOT NULL,
    "title" TEXT,

    CONSTRAINT "example_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course"."faculties" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "faculties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course"."learning_paths" (
    "id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "badge_url" TEXT NOT NULL,
    "is_school" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "learning_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course"."courses" (
    "id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "goals" TEXT[],
    "level" "course"."course_levels" NOT NULL,
    "url" TEXT NOT NULL,
    "badge_url" TEXT NOT NULL,
    "expected_reviews" INTEGER NOT NULL DEFAULT 0,
    "are_reviews_already_scraped" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course"."teachers" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review"."reviewers" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,

    CONSTRAINT "reviewers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review"."reviews" (
    "id" TEXT NOT NULL,
    "reviewer_username" TEXT NOT NULL,
    "course_slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course"."_CourseToLearningPath" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "faculties_slug_key" ON "course"."faculties"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "learning_paths_slug_key" ON "course"."learning_paths"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "learning_paths_url_key" ON "course"."learning_paths"("url");

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "course"."courses"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "courses_url_key" ON "course"."courses"("url");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_username_key" ON "course"."teachers"("username");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_url_key" ON "course"."teachers"("url");

-- CreateIndex
CREATE UNIQUE INDEX "reviewers_username_key" ON "review"."reviewers"("username");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_reviewer_username_course_slug_key" ON "review"."reviews"("reviewer_username", "course_slug");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToLearningPath_AB_unique" ON "course"."_CourseToLearningPath"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToLearningPath_B_index" ON "course"."_CourseToLearningPath"("B");

-- AddForeignKey
ALTER TABLE "course"."learning_paths" ADD CONSTRAINT "learning_paths_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "course"."faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course"."courses" ADD CONSTRAINT "courses_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "course"."faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course"."courses" ADD CONSTRAINT "courses_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "course"."teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review"."reviews" ADD CONSTRAINT "reviews_reviewer_username_fkey" FOREIGN KEY ("reviewer_username") REFERENCES "review"."reviewers"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review"."reviews" ADD CONSTRAINT "reviews_course_slug_fkey" FOREIGN KEY ("course_slug") REFERENCES "course"."courses"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course"."_CourseToLearningPath" ADD CONSTRAINT "_CourseToLearningPath_A_fkey" FOREIGN KEY ("A") REFERENCES "course"."courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course"."_CourseToLearningPath" ADD CONSTRAINT "_CourseToLearningPath_B_fkey" FOREIGN KEY ("B") REFERENCES "course"."learning_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add check constraint to rating column
ALTER TABLE "review"."reviews"
ADD CONSTRAINT check_rating_range
CHECK (rating >= 0 AND rating <= 5);
-- CreateIndex
CREATE INDEX "reviews_reviewer_username_idx" ON "review"."reviews"("reviewer_username");

-- CreateIndex
CREATE INDEX "reviews_course_slug_idx" ON "review"."reviews"("course_slug");

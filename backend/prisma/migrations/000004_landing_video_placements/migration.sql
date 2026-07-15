-- Existing channel records stay in the supervisor video library. Landing
-- placements are populated by the restore seed with the supplied YouTube IDs.
ALTER TABLE "ChannelVideo"
  ADD COLUMN "placement" TEXT NOT NULL DEFAULT 'library';

CREATE INDEX "ChannelVideo_placement_idx" ON "ChannelVideo"("placement");

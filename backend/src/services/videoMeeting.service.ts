export type MeetingInput = {
  title: string;
  meetingLink?: string | null;
};

export class VideoMeetingService {
  async prepareMeeting(input: MeetingInput) {
    return {
      meetingProvider: input.meetingLink ? "manual" : null,
      meetingLink: input.meetingLink || null
    };
  }
}

export const videoMeetingService = new VideoMeetingService();

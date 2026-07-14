export interface LabelNewsItem {
  id: string;
  labelSlug: string;
  type: "new_release" | "demo_status_open";
  title: string;
  description: string;
  /** ISO date — only surfaced as a notification if it's after the producer's `since` follow date. */
  date: string;
  /** Display string for the notifications panel, same convention as the other mock notifications. */
  time: string;
}

export const mockLabelNews: LabelNewsItem[] = [
  {
    id: "news-sudbeat-1",
    labelSlug: "sudbeat",
    type: "new_release",
    title: "New release from Sudbeat",
    description: "Sudbeat just dropped a new release — worth a listen before your next submission.",
    date: "2026-07-01",
    time: "9 days ago",
  },
  {
    id: "news-addictive-1",
    labelSlug: "addictive-music",
    type: "demo_status_open",
    title: "Addictive Music is open for demos",
    description: "Addictive Music opened up for unsolicited demo submissions.",
    date: "2026-07-03",
    time: "7 days ago",
  },
];

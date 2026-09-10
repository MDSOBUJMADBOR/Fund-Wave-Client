
export interface Campaign {
  _id: string;
  campaign_title: string;
  campaign_image_url: string;
  funding_goal: number | string;
  minimum_contribution: number | string;
  campaign_story: string;
  deadline: string;
  status: string;
}
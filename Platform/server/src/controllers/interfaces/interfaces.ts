export interface Game {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
  has_community_visible_stats: boolean;
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
  rtime_last_played: number;
  content_descriptorids: number[];
  playtime_disconnected: number;
}


export interface User {
  _id?: string;
  email: string;
  userName?: string | null;   // '?' indicates that the property is optional
  steamID?: string;
  password: string;
  zone: string;
  games?: Game[];  // Uses the Game interface
  selectedGames?: any[];  // Specify more specific type if possible
  virtualMachine?: string;
  SubscriptionStatus?: boolean;
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { YouTubePlaylist } from "@/types/career";
import { Youtube, Play } from "lucide-react";

interface YouTubeSectionProps {
  playlists: YouTubePlaylist[];
}

export const YouTubeSection = ({ playlists }: YouTubeSectionProps) => {
  return (
    <Card className="bg-card shadow-sm border rounded-3xl overflow-hidden h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <Youtube className="h-5 w-5 text-destructive" />
          YouTube Playlists
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {playlists.map((playlist, index) => (
            <a
              key={index}
              href={playlist.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-xl bg-secondary/50 border border-border/50 hover:border-destructive/50 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0 group-hover:bg-destructive/20 transition-colors">
                  <Play className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground group-hover:text-destructive transition-colors line-clamp-2">
                    {playlist.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    by {playlist.channel}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

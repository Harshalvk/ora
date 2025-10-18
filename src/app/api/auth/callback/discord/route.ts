import axios from "axios";
import { NextResponse, NextRequest } from "next/server";
import url from "url";

export async function GET(req: NextRequest) {
  try {
    console.log(req.url);
    const code = req.nextUrl.searchParams.get("code");
    
    if (code) {
      const data = new url.URLSearchParams();
      data.append("client_id", process.env.DISCORD_CLIENT_ID!);
      data.append("client_secret", process.env.DISCORD_CLIENT_SECRET!);
      data.append("grant_type", "authorization_code");
      data.append(
        "redirect_uri",
        "http://localhost:3000/api/auth/callback/discord"
      );
      data.append("code", code.toString());

      const output = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data),
      });

      if (output.ok) {
        const response = await output.json();
        const access = response.access_token;
        const UserGuilds: any = await axios.get(
          `https://discord.com/api/users/@me/guilds`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

        const UserGuild = UserGuilds.data.filter(
          (guild: any) => guild.id == response.webhook.guild_id
        );

        return NextResponse.redirect(
          `http://localhost:3000/connections?webhook_id=${response.webhook.id}&webhook_url=${response.webhook.url}&webhook_name=${response.webhook.name}&guild_id=${response.webhook.guild_id}&guild_name=${UserGuild[0].name}&channel_id=${response.webhook.channel_id}`
        );
      }
    }
    return NextResponse.redirect("https://localhost:3000/connections");
  } catch (error) {
    console.error("Failed discord callback route: ", error);
    return NextResponse.json(
      { error: "Failed discord callback route" },
      { status: 500 }
    );
  }
}

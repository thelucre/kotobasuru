import { useEffect, useState } from "react";
import { Platform } from "react-native";
import RNFS from "react-native-fs";
import StaticServer from "react-native-static-server";

const GBA_FOLDER = "emu-server";

let cachedServer: StaticServer | null = null;
let cachedUrl: string | null = null;

export function useLocalGbaServer(): string | null {
  const [serverUrl, setServerUrl] = useState<string | null>(cachedUrl);

  useEffect(() => {
    let server: StaticServer;

    const start = async () => {
      try {
        if (cachedUrl) {
          console.log("[EMU Server] Using cached URL:", cachedUrl);
          setServerUrl(cachedUrl);
          return;
        }

        try {
          const mainPath = RNFS.MainBundlePath;
          console.log("[RNFS] MainBundlePath:", mainPath);

          const rootFiles = await RNFS.readDir(mainPath);
          console.log("[RNFS] 📂 Contents of MainBundlePath:");
          for (const f of rootFiles) {
            console.log(`  - ${f.name} (${f.isDirectory() ? "dir" : "file"})`);
          }
        } catch (err) {
          console.error("[RNFS] ❌ Error reading MainBundlePath:", err.message);
        }

        const rootPath =
          Platform.OS === "ios"
            ? `${RNFS.MainBundlePath}/${GBA_FOLDER}`
            : `asset:///${GBA_FOLDER}`;

        console.log("[EMU Server] Starting StaticServer from:", rootPath);

        try {
          const files = await RNFS.readDir(rootPath);
          console.log(`[GBA Server] 📂 Contents of ${rootPath}:`);
          for (const file of files) {
            console.log(
              `  - ${file.name} (${file.isDirectory() ? "dir" : "file"})`
            );
          }
        } catch (err) {
          console.warn(
            `[GBA Server] ❌ Failed to readDir at ${rootPath}:`,
            err.message
          );
        }

        server = new StaticServer(1337, rootPath, { localOnly: true });
        cachedServer = server;

        const url = await server.start();
        console.log("[EMU Server] Started at", url);

        cachedUrl = url;
        setServerUrl(url);
      } catch (err) {
        console.error("[EMU Server] Failed to start:", err);
      }
    };

    start();

    return () => {
      if (server && server === cachedServer) {
        console.log("[EMU Server] Stopping StaticServer");
        server.stop();
        cachedServer = null;
        cachedUrl = null;
      }
    };
  }, []);

  return serverUrl;
}

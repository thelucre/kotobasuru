// useLocalGbaServer.tsx
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import RNFS from "react-native-fs";
import StaticServer from "react-native-static-server";

const GBA_FOLDER = "gba-server";

export function useLocalGbaServer(): string | null {
  const [serverUrl, setServerUrl] = useState<string | null>(null);

  useEffect(() => {
    let server: StaticServer;

    const copyBundleToDocument = async () => {
      const destDir = `${RNFS.DocumentDirectoryPath}/${GBA_FOLDER}`;
      const exists = await RNFS.exists(destDir);
      if (exists) return destDir;

      const srcDir =
        Platform.OS === "ios"
          ? `${RNFS.MainBundlePath}/${GBA_FOLDER}`
          : `asset:///${GBA_FOLDER}`;

      console.log(`[GBA Server] Copying from ${srcDir} to ${destDir}`);

      await RNFS.mkdir(destDir);

      // Manually list and copy key files (you can automate this with a manifest later)
      const files = [
        "index.html",
        "minnish.gba",
        "resources/bios.bin",
        "js/gba.js",
        "js/util.js",
        "js/video.js",
        "js/video/proxy.js",
        "js/video/software.js",
        "js/core.js",
        "js/keypad.js",
        "js/mmu.js",
        "js/audio.js",
        "js/irq.js",
        "js/sio.js",
        "js/savedata.js",
        "js/io.js",
        "js/arm.js",
        "js/thumb.js",
        "resources/xhr.js",
      ];

      for (const file of files) {
        const srcPath = `${srcDir}/${file}`;
        const destPath = `${destDir}/${file}`;
        const destSubfolder = destPath.split("/").slice(0, -1).join("/");
        await RNFS.mkdir(destSubfolder); // create js/ and resources/ subfolders
        await RNFS.copyFile(srcPath, destPath);
      }

      return destDir;
    };

    const start = async () => {
      try {
        const root = await copyBundleToDocument();
        server = new StaticServer(1337, root, { localOnly: true });
        const url = await server.start();
        console.log("[GBA Server] Started at", url);
        setServerUrl(url);
      } catch (err) {
        console.error("[GBA Server] Failed to start:", err);
      }
    };

    start();

    return () => {
      if (server) server.stop();
    };
  }, []);

  return serverUrl;
}

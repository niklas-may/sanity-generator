import { createConfig } from "../../src";
import baseConfig from "./generator-config-base";

const [config, options] = baseConfig;

export default createConfig(config, { ...options, inlineResolver: false, trim: true });

import { Summaly } from './summaly';

interface IPlugin {
	test: (url: URL) => boolean;
	summarize: (url: URL, lang?: string) => Promise<Summaly>;
}

export default IPlugin;

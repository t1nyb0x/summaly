import Summary from './summary';

interface IPlugin {
	test: (url: URL) => boolean;
	summarize: (url: URL, lang?: string) => Promise<Summary>;
}

export default IPlugin;

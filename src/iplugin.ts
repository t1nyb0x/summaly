import { SummalyEx } from './summaly';

interface IPlugin {
	test: (url: URL) => boolean;
	postProcess: (summaly: SummalyEx) => Promise<SummalyEx>;
}

export default IPlugin;

import { HumeClient } from 'hume';

export class HumeService {
    private static instance: HumeService;
    private client: HumeClient;

    private constructor() {
        const apiKey = import.meta.env.VITE_HUME_API_KEY;
        if (!apiKey) {
            throw new Error('VITE_HUME_API_KEY is required');
        }

        this.client = new HumeClient({
            apiKey,
            // Configure timeout and retries
            timeout: 30000, // 30 seconds
            maxRetries: 3,
        });
    }

    public static getInstance(): HumeService {
        if (!HumeService.instance) {
            HumeService.instance = new HumeService();
        }
        return HumeService.instance;
    }

    public async analyzeFacialExpressions(urls: string[]) {
        try {
            const job = await this.client.expressionMeasurement.batch.startInferenceJob({
                models: {
                    face: {
                        facs: {},
                        descriptions: {},
                        emotions: {},
                    },
                },
                urls: urls,
            });

            await job.awaitCompletion();
            return await this.client.expressionMeasurement.batch.getJobPredictions(job.jobId);
        } catch (error) {
            console.error('Failed to analyze facial expressions:', error);
            throw error;
        }
    }

    public async analyzeProsody(urls: string[]) {
        try {
            const job = await this.client.prosodyMeasurement.batch.startInferenceJob({
                models: {
                    prosody: {
                        granularity: "utterance",
                        identify_speakers: true,
                    },
                },
                urls: urls,
            });

            await job.awaitCompletion();
            return await this.client.prosodyMeasurement.batch.getJobPredictions(job.jobId);
        } catch (error) {
            console.error('Failed to analyze prosody:', error);
            throw error;
        }
    }

    public async analyzeLanguage(text: string) {
        try {
            const job = await this.client.languageMeasurement.batch.startInferenceJob({
                models: {
                    language: {
                        granularity: "sentence",
                        identify_speakers: true,
                    },
                },
                text: [text],
            });

            await job.awaitCompletion();
            return await this.client.languageMeasurement.batch.getJobPredictions(job.jobId);
        } catch (error) {
            console.error('Failed to analyze language:', error);
            throw error;
        }
    }
}

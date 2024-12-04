import { useState } from 'react';
import { HumeService } from '../../services/hume';

export function HumeTest() {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const testHume = async () => {
        const hume = HumeService.getInstance();
        setLoading(true);
        setError(null);
        
        try {
            // Test facial expressions
            const emotions = await hume.analyzeFacialExpressions([
                'https://hume-tutorials.s3.amazonaws.com/faces.zip'
            ]);
            setResult(emotions);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <button 
                onClick={testHume}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {loading ? 'Analyzing...' : 'Test Hume API'}
            </button>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            {result && (
                <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
                    {JSON.stringify(result, null, 2)}
                </pre>
            )}
        </div>
    );
}

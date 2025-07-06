export default function ResultCard({ result }) {
  return (
    <div className="p-4 border rounded shadow mt-4">
      <h2 className="font-semibold text-lg mb-2">Analysis Result:</h2>
      <ul className="space-y-1">
        <li><strong>Load Time:</strong> {result.loadTime} seconds</li>
        <li><strong>Page Size:</strong> {result.pageSize} KB</li>
        <li><strong>Number of Requests:</strong> {result.requestCount}</li>
      </ul>
    </div>
  );
}

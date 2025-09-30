import { BigQuery } from "@google-cloud/bigquery";

export default async function HomePage() {
  const client = new BigQuery();

  const query = `SELECT name
      FROM \`bigquery-public-data.usa_names.usa_1910_2013\`
      WHERE state = 'TX'
      LIMIT 100`;

  // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
  const options = {
    query: query,
    // Location must match that of the dataset(s) referenced in the query.
    location: "US",
  };

  // Run the query as a job
  const [job] = await client.createQueryJob(options);
  console.log(`Job ${job.id} started.`);

  // Wait for the query to finish
  const [rows] = await job.getQueryResults();

  // Print the results
  console.log("Rows:");

  return (
    <h1 className="text-3xl font-bold underline">
      {rows.map((row: any) => (
        <p>{JSON.stringify(row)}</p>
      ))}
    </h1>
  );
}

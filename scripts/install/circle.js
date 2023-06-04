const { writeFile } = require('fs/promises');

const [ repo, branch, workflowName, jobName, artifactPath, outputPath ] = process.argv.slice(2);
const { CIRCLE_TOKEN } = process.env;

const get = async url => await (await fetch(url, {
  headers: {
    'Circle-Token': CIRCLE_TOKEN
  }
})).json();

(async () => {
  const pipelines = await get(`https://circleci.com/api/v2/project/gh/${repo}/pipeline?branch=${branch}`);
  const pipeline = pipelines.items[0];
  console.log('got pipeline', pipeline.id);

  writeFile('version.txt', pipeline.vcs.revision);

  const workflows = await get(`https://circleci.com/api/v2/pipeline/${pipeline.id}/workflow`);
  const workflow = workflows.items.find(x => x.name === workflowName);
  console.log('got workflow', workflow.id);

  const jobs = await get(`https://circleci.com/api/v2/workflow/${workflow.id}/job`);
  const job = jobs.items.find(x => x.name === jobName);
  console.log('got job', job.job_number);

  const artifacts = await get(`https://circleci.com/api/v2/project/gh/${repo}/${job.job_number}/artifacts`);
  const artifact = artifacts.items.find(x => x.path === artifactPath);
  console.log('got artifact', artifact);

  await writeFile(outputPath, Buffer.from(await (await fetch(artifact.url)).arrayBuffer()));
})();
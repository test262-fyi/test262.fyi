const { writeFile } = require('fs/promises');

const [ repo, branch, workflowName, jobName, artifactPath, outputPath ] = process.argv.slice(2);
const { CIRCLE_TOKEN } = process.env;

const get = async url => await (await fetch(url, {
  headers: {
    'Circle-Token': CIRCLE_TOKEN
  }
})).json();

const getPipeline = async (index = 0) => (await get(`https://circleci.com/api/v2/project/gh/${repo}/pipeline?branch=${branch}`)).items.filter(x => x.errors.length === 0)[index];

(async () => {
  let pipeline, workflow, index = 0;
  while (!workflow) {
    pipeline = await getPipeline(index++);
    console.log('got pipeline', pipeline.id);

    const workflows = await get(`https://circleci.com/api/v2/pipeline/${pipeline.id}/workflow`);
    workflow = workflows.items.find(x => x.name === workflowName && x.status !== 'running');
    console.log('got workflow', workflow?.id);
  }

  writeFile('version.txt', pipeline.vcs.revision);

  const jobs = await get(`https://circleci.com/api/v2/workflow/${workflow.id}/job`);
  const job = jobs.items.find(x => x.name === jobName);
  console.log('got job', job.job_number);

  const artifacts = await get(`https://circleci.com/api/v2/project/gh/${repo}/${job.job_number}/artifacts`);
  const artifact = artifacts.items.find(x => x.path === artifactPath);
  console.log('got artifact', artifact);

  await writeFile(outputPath, Buffer.from(await (await fetch(artifact.url)).arrayBuffer()));
})();
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  advisoryBoardDomains,
  directoryDomains,
  getResourceDomains,
  matchesResource,
  projectIdeas,
  resources,
  workflows,
} from '../app/resource-data.ts';

const legacyDomains = [
  'Illustration', 'Graphic Design', 'Animation & Video', 'Motion Graphics',
  '3D & Spatial', 'Prototype & Engineering', 'Apps & Games',
  'Research & Learning', 'Audio', 'Responsible Practice',
];
const find = (name) => {
  const resource = resources.find((item) => item.name === name);
  assert.ok(resource, `Missing resource: ${name}`);
  return resource;
};
const filter = (overrides = {}) => ({ query: '', category: 'all', status: 'all', ...overrides });

test('all original domains remain populated and first in their existing order', () => {
  assert.deepEqual(directoryDomains.slice(0, legacyDomains.length), legacyDomains);
  for (const category of legacyDomains) {
    assert.ok(resources.some((item) => item.category === category));
  }
});

test('every advisory board area and project management has relevant resources', () => {
  for (const category of [...advisoryBoardDomains, 'Project Management']) {
    assert.ok(directoryDomains.includes(category), category);
    assert.ok(resources.some((item) => matchesResource(item, filter({ category }))), category);
  }
  assert.equal(new Set(directoryDomains).size, directoryDomains.length);
});

test('existing coding tools retain their primary domain and appear in computer science', () => {
  for (const name of ['GitHub Copilot', 'Claude Code', 'Cursor', 'ChatGPT', 'Google AI Studio', 'Vercel v0']) {
    const resource = find(name);
    assert.equal(resource.category, 'Apps & Games');
    assert.ok(matchesResource(resource, filter({ category: 'Apps & Games' })));
    assert.ok(matchesResource(resource, filter({ category: 'Computer Science & Design' })));
  }
});

test('search includes secondary domains without duplicating resources', () => {
  const matches = resources.filter((item) => matchesResource(item, filter({ query: '  COMPUTER SCIENCE  ' })));
  assert.ok(matches.some((item) => item.name === 'GitHub Copilot'));
  assert.equal(new Set(matches.map((item) => item.name)).size, matches.length);
  const resource = find('Miro AI');
  assert.ok(getResourceDomains(resource).includes('Project Management'));
});

test('query, domain, and status combine and can exclude an otherwise matching tool', () => {
  const octanorm = find('OCTANORM AI Booth Designer');
  const filters = filter({ query: 'CAD import', category: 'Exhibit & Experience Design', status: 'review' });
  assert.ok(matchesResource(octanorm, filters));
  assert.ok(!matchesResource(octanorm, { ...filters, status: 'verified' }));
  assert.ok(!matchesResource(octanorm, { ...filters, category: 'Audio' }));
  assert.ok(!matchesResource(octanorm, { ...filters, query: 'unmatched phrase' }));
});

test('references are discoverable through domain and status filters', () => {
  assert.ok(matchesResource(find('UNESCO AI Competency Frameworks'), filter({ category: 'Visual Arts Education', status: 'reference' })));
  assert.ok(matchesResource(find('Hugging Face LLM Course'), filter({ category: 'Computer Science & Design', status: 'reference' })));
});

test('directory entries and workflow identifiers are unique and links use HTTPS', () => {
  assert.equal(new Set(resources.map((item) => item.name)).size, resources.length);
  assert.equal(new Set(workflows.map((item) => item.number)).size, workflows.length);
  for (const item of resources) {
    assert.equal(new URL(item.url).protocol, 'https:');
    if (item.exampleUrl) assert.equal(new URL(item.exampleUrl).protocol, 'https:');
  }
});

test('fly-through project remains and does not imply a finished tutorial', () => {
  const project = projectIdeas.find((item) => item.title === 'Exhibit design fly-through');
  assert.ok(project);
  assert.match(project.format, /3ds Max primary \/ Blender alternate/);
  assert.match(project.format, /tutorials forthcoming/);
});

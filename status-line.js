// Status line configuration for Claude Code
// Shows: shortened path, model name, and context usage percentage

function getShortPath(cwd) {
  const home = process.env.HOME;
  let path = cwd;
  
  // Replace home directory with ~
  if (path.startsWith(home)) {
    path = '~' + path.slice(home.length);
  }
  
  const parts = path.split('/').filter(p => p);
  
  // Keep only last 1-2 directories
  if (parts.length > 2) {
    return '.../' + parts.slice(-2).join('/');
  } else if (parts.length > 1) {
    return parts.join('/');
  } else if (parts.length === 1) {
    return parts[0];
  }
  
  return path === '~' ? '~' : '/';
}

function getModelName(model) {
  // Shorten common model names
  if (model.includes('claude-3-5-sonnet')) return 'Sonnet 3.5';
  if (model.includes('claude-sonnet-4')) return 'Sonnet 4';
  if (model.includes('claude-3-haiku')) return 'Haiku';
  if (model.includes('claude-3-opus')) return 'Opus';
  
  // Fallback to first part of model name
  return model.split('-')[0] || 'Claude';
}

function formatContextUsage(contextUsage) {
  const percentage = Math.round((contextUsage.used / contextUsage.limit) * 100);
  return `${percentage}%`;
}

module.exports = function(context) {
  const { cwd, model, contextUsage } = context;
  
  const shortPath = getShortPath(cwd);
  const modelName = getModelName(model);
  const usage = formatContextUsage(contextUsage);
  
  return `${shortPath} | ${modelName} | ${usage}`;
};
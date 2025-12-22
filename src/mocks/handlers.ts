import { http, HttpResponse } from 'msw';
import type { Organization, Workspace, Project, Workflow } from '@/lib/types';

const containers = [
  {
    id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    name: 'project-alpha-dev',
    status: 'running',
    folderMapping: '/Users/lex/projects/alpha:/app',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    name: 'project-beta-staging',
    status: 'stopped',
    folderMapping: '/Users/lex/projects/beta:/app',
    createdAt: new Date().toISOString(),
  },
];

// Mock data for organizations, workspaces, projects, and workflows
const mockOrganizations: Organization[] = [
  {
    id: 'org-001',
    name: 'Acme Corp',
    folderPath: 'acme-corp',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'org-002',
    name: 'Beta Startups',
    folderPath: 'beta-startups',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '0d9cfbf3-f4a2-412e-922a-c7d199071558',
    name: 'Gamma Labs',
    folderPath: 'gamma-labs',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockWorkspaces: Workspace[] = [
  {
    id: 'ws-001',
    organizationId: 'org-001',
    name: 'Frontend Team',
    folderPath: 'frontend',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ws-002',
    organizationId: 'org-001',
    name: 'Backend Team',
    folderPath: 'backend',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ws-003',
    organizationId: 'org-002',
    name: 'Product Dev',
    folderPath: 'product',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ws-004',
    organizationId: '0d9cfbf3-f4a2-412e-922a-c7d199071558',
    name: 'AI Research',
    folderPath: 'ai-research',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockProjects: Project[] = [
  {
    id: 'proj-001',
    workspaceId: 'ws-001',
    name: 'Dashboard UI',
    folderPath: 'dashboard-ui',
    aiConfig: {
      aiWindows: [
        { type: 'qwen', apiKey: '', model: '', baseUrl: '' },
        { type: 'none', apiKey: '', model: '', baseUrl: '' },
        { type: 'none', apiKey: '', model: '', baseUrl: '' },
        { type: 'none', apiKey: '', model: '', baseUrl: '' },
        { type: 'none', apiKey: '', model: '', baseUrl: '' }
      ],
      folderMappings: [
        { hostPath: '/Users/lex/projects/dashboard-shared', containerPath: '/shared' }
      ]
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj-002',
    workspaceId: 'ws-002',
    name: 'API Server',
    folderPath: 'api-server',
    aiConfig: {
      aiWindows: [
        { type: 'claude', apiKey: '', model: '', baseUrl: '' },
        { type: 'none', apiKey: '', model: '', baseUrl: '' },
        { type: 'none', apiKey: '', model: '', baseUrl: '' },
        { type: 'none', apiKey: '', model: '', baseUrl: '' },
        { type: 'none', apiKey: '', model: '', baseUrl: '' }
      ],
      folderMappings: [
        { hostPath: '/Users/lex/projects/api-shared', containerPath: '/shared' },
        { hostPath: '/Users/lex/projects/common-libs', containerPath: '/libs' }
      ]
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockWorkflows: Workflow[] = [
  {
    id: 'wf-001',
    name: 'Standard Development Workflow',
    description: 'Basic workflow for standard development projects',
    status: 'published',
    currentVersion: 1,
    definition: {
      phases: [
        {
          id: 'planning',
          title: 'Planning',
          titleEn: 'Planning',
          description: 'Project planning and requirements gathering',
          color: '#e3f2fd',
          steps: [
            {
              id: 'req-gathering',
              title: 'Requirements Gathering',
              description: 'Gather and document project requirements',
              type: 'process',
              workflows: [],
            },
            {
              id: 'tech-design',
              title: 'Technical Design',
              description: 'Create technical design documentation',
              type: 'process',
              workflows: [],
            }
          ]
        },
        {
          id: 'implementation',
          title: 'Implementation',
          titleEn: 'Implementation',
          description: 'Implementation phase',
          color: '#e8f5e9',
          steps: [
            {
              id: 'coding',
              title: 'Coding',
              description: 'Write code for the project',
              type: 'process',
              workflows: [],
            }
          ]
        }
      ],
      transitions: [
        {
          from: 'planning',
          to: 'implementation',
          label: 'Start Implementation',
          type: 'forward'
        }
      ]
    },
    isTemplate: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const handlers = [
  // List containers
  http.get('/api/flexy', () => {
    return HttpResponse.json(containers);
  }),

  // Create container
  http.post('/api/flexy', async ({ request }) => {
    const newContainer = await request.json() as any;
    const container = {
      id: crypto.randomUUID(),
      status: 'running',
      createdAt: new Date().toISOString(),
      ...newContainer,
    };
    containers.push(container);
    return HttpResponse.json(container, { status: 201 });
  }),

  // Stop container
  http.post('/api/flexy/:id/stop', ({ params }) => {
    const container = containers.find(c => c.id === params.id);
    if (container) {
      container.status = 'stopped';
    }
    return new HttpResponse(null, { status: 204 });
  }),

  // Start container
  http.post('/api/flexy/:id/start', ({ params }) => {
    const container = containers.find(c => c.id === params.id);
    if (container) {
      container.status = 'running';
    }
    return new HttpResponse(null, { status: 204 });
  }),

  // Delete container
  http.delete('/api/flexy/:id', ({ params }) => {
    const index = containers.findIndex(c => c.id === params.id);
    if (index > -1) {
      containers.splice(index, 1);
    }
    return new HttpResponse(null, { status: 204 });
  }),

  // List host directories
  http.post('/api/host/directories', () => {
    return HttpResponse.json({
      currentPath: '/Users/lex/projects',
      directories: ['project-alpha', 'project-beta', 'project-gamma'],
    });
  }),

  // Health check
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok', uptime: 123.45 });
  }),

  // Organizations API
  http.get('/api/organizations', () => {
    return HttpResponse.json(mockOrganizations);
  }),

  http.get('/api/organizations/:id', ({ params }) => {
    const org = mockOrganizations.find(o => o.id === params.id);
    if (!org) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(org);
  }),

  http.post('/api/organizations', async ({ request }) => {
    const body = await request.json();
    if (!body || typeof body !== 'object' || !body.name || !body.folderPath) {
      return new HttpResponse(null, { status: 400 });
    }
    
    const newOrg: Organization = {
      id: crypto.randomUUID(),
      name: body.name,
      folderPath: body.folderPath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockOrganizations.push(newOrg);
    return HttpResponse.json(newOrg, { status: 201 });
  }),

  http.put('/api/organizations/:id', async ({ params, request }) => {
    const orgIndex = mockOrganizations.findIndex(o => o.id === params.id);
    if (orgIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return new HttpResponse(null, { status: 400 });
    }
    
    const updatedOrg: Organization = {
      ...mockOrganizations[orgIndex],
      ...body,
      id: mockOrganizations[orgIndex].id, // Preserve the ID
      createdAt: mockOrganizations[orgIndex].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(), // Update the timestamp
    };
    
    mockOrganizations[orgIndex] = updatedOrg;
    return HttpResponse.json(updatedOrg);
  }),

  http.delete('/api/organizations/:id', ({ params }) => {
    const orgIndex = mockOrganizations.findIndex(o => o.id === params.id);
    if (orgIndex !== -1) {
      mockOrganizations.splice(orgIndex, 1);
      
      // Also remove associated workspaces and projects
      const workspacesToRemove = mockWorkspaces.filter(ws => ws.organizationId === params.id);
      workspacesToRemove.forEach(ws => {
        const projectIndex = mockProjects.findIndex(p => p.workspaceId === ws.id);
        if (projectIndex !== -1) {
          mockProjects.splice(projectIndex, 1);
        }
      });
      
      const workspaceIds = workspacesToRemove.map(ws => ws.id);
      mockWorkspaces.splice(
        0,
        mockWorkspaces.length,
        ...mockWorkspaces.filter(ws => !workspaceIds.includes(ws.id))
      );
    }
    return new HttpResponse(null, { status: 204 });
  }),

  // Workspaces API
  http.get('/api/organizations/:organizationId/workspaces', ({ params }) => {
    const organizationId = params.organizationId as string;
    const workspaces = mockWorkspaces.filter(ws => ws.organizationId === organizationId);
    return HttpResponse.json(workspaces);
  }),

  http.get('/api/workspaces', () => {
    return HttpResponse.json(mockWorkspaces);
  }),
  
  http.get('/api/workspaces/:id', ({ params }) => {
    const workspace = mockWorkspaces.find(ws => ws.id === params.id);
    if (!workspace) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(workspace);
  }),

  http.post('/api/organizations/:organizationId/workspaces', async ({ params, request }) => {
    const body = await request.json();
    if (!body || typeof body !== 'object' || !body.name || !body.folderPath) {
      return new HttpResponse(null, { status: 400 });
    }
    
    const organizationId = params.organizationId as string;
    const newWorkspace: Workspace = {
      id: crypto.randomUUID(),
      organizationId: organizationId,
      name: body.name,
      folderPath: body.folderPath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockWorkspaces.push(newWorkspace);
    return HttpResponse.json(newWorkspace, { status: 201 });
  }),

  http.put('/api/workspaces/:id', async ({ params, request }) => {
    const wsIndex = mockWorkspaces.findIndex(ws => ws.id === params.id);
    if (wsIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return new HttpResponse(null, { status: 400 });
    }
    
    const updatedWorkspace: Workspace = {
      ...mockWorkspaces[wsIndex],
      ...body,
      id: mockWorkspaces[wsIndex].id, // Preserve the ID
      createdAt: mockWorkspaces[wsIndex].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(), // Update the timestamp
    };
    
    mockWorkspaces[wsIndex] = updatedWorkspace;
    return HttpResponse.json(updatedWorkspace);
  }),

  http.delete('/api/workspaces/:id', ({ params }) => {
    const wsIndex = mockWorkspaces.findIndex(ws => ws.id === params.id);
    if (wsIndex !== -1) {
      // Remove associated projects
      const projectIndex = mockProjects.findIndex(p => p.workspaceId === params.id);
      if (projectIndex !== -1) {
        mockProjects.splice(projectIndex, 1);
      }
      mockWorkspaces.splice(wsIndex, 1);
    }
    return new HttpResponse(null, { status: 204 });
  }),

  // Projects API
  http.get('/api/workspaces/:workspaceId/projects', ({ params }) => {
    const workspaceId = params.workspaceId as string;
    const projects = mockProjects.filter(p => p.workspaceId === workspaceId);
    return HttpResponse.json(projects);
  }),
  
  http.get('/api/projects', () => {
    return HttpResponse.json(mockProjects);
  }),
  
  http.get('/api/projects/:id', ({ params }) => {
    const project = mockProjects.find(p => p.id === params.id);
    if (!project) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(project);
  }),

  http.post('/api/workspaces/:workspaceId/projects', async ({ params, request }) => {
    const body = await request.json();
    if (!body || typeof body !== 'object' || !body.name || !body.folderPath) {
      return new HttpResponse(null, { status: 400 });
    }
    
    const workspaceId = params.workspaceId as string;
    const newProject: Project = {
      id: crypto.randomUUID(),
      workspaceId: workspaceId,
      name: body.name,
      folderPath: body.folderPath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProjects.push(newProject);
    return HttpResponse.json(newProject, { status: 201 });
  }),

  http.put('/api/projects/:id', async ({ params, request }) => {
    const projIndex = mockProjects.findIndex(p => p.id === params.id);
    if (projIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return new HttpResponse(null, { status: 400 });
    }

    const updatedProject: Project = {
      ...mockProjects[projIndex],
      ...body,
      id: mockProjects[projIndex].id, // Preserve the ID
      createdAt: mockProjects[projIndex].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(), // Update the timestamp
    };

    mockProjects[projIndex] = updatedProject;
    return HttpResponse.json(updatedProject);
  }),

  http.delete('/api/projects/:id', ({ params }) => {
    const projIndex = mockProjects.findIndex(p => p.id === params.id);
    if (projIndex !== -1) {
      mockProjects.splice(projIndex, 1);
    }
    return new HttpResponse(null, { status: 204 });
  }),

  // Workflows API
  http.get('/api/workflows', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    
    if (status) {
      const filteredWorkflows = mockWorkflows.filter(wf => wf.status === status);
      return HttpResponse.json(filteredWorkflows);
    }
    
    return HttpResponse.json(mockWorkflows);
  }),

  http.get('/api/workflows/:id', ({ params }) => {
    const workflow = mockWorkflows.find(wf => wf.id === params.id);
    if (!workflow) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(workflow);
  }),

  http.post('/api/workflows', async ({ request }) => {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return new HttpResponse(null, { status: 400 });
    }
    
    const newWorkflow: Workflow = {
      id: crypto.randomUUID(),
      name: (body.name as string) || 'New Workflow',
      description: (body.description as string) || '',
      status: (body.status as 'published' | 'draft' | 'archived') || 'draft',
      currentVersion: 1,
      definition: body.definition || { phases: [], transitions: [] },
      isTemplate: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockWorkflows.push(newWorkflow);
    return HttpResponse.json(newWorkflow, { status: 201 });
  }),

  http.put('/api/workflows/:id', async ({ params, request }) => {
    const wfIndex = mockWorkflows.findIndex(wf => wf.id === params.id);
    if (wfIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return new HttpResponse(null, { status: 400 });
    }
    
    const updatedWorkflow: Workflow = {
      ...mockWorkflows[wfIndex],
      ...body,
      id: mockWorkflows[wfIndex].id, // Preserve the ID
      createdAt: mockWorkflows[wfIndex].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(), // Update the timestamp
    };
    
    mockWorkflows[wfIndex] = updatedWorkflow;
    return HttpResponse.json(updatedWorkflow);
  }),

  http.delete('/api/workflows/:id', ({ params }) => {
    const wfIndex = mockWorkflows.findIndex(wf => wf.id === params.id);
    if (wfIndex !== -1) {
      mockWorkflows.splice(wfIndex, 1);
    }
    return new HttpResponse(null, { status: 204 });
  }),
];

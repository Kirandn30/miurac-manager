import { createSlice } from '@reduxjs/toolkit';
import { Timestamp } from 'firebase/firestore';


export interface ProjectDetailsState {
    ProjectsDetails: ProjectDetailsType[]
}

const initialState: ProjectDetailsState = {
    ProjectsDetails: []
};

export const ProjectDetailsSlice = createSlice({
    name: 'Project Details',
    initialState,
    reducers: {
        setProjectDetails: (state, action) => {
            state.ProjectsDetails = action.payload
        }
    },
});


export const { setProjectDetails } = ProjectDetailsSlice.actions;

export const ProjectDetailsSliceReduser = ProjectDetailsSlice.reducer;


export interface ProjectDetailsType {
    projectSuccessDiscription: string
    estimatedBudject: EstimatedBudject[]
    procurements: Procurement[]
    humanResourceRequriments: HumanResourceRequriment[]
    clientPhone: string
    clientName: string
    risks: string
    country: string
    state: string
    projectId: string
    projectName: string
    estimatedSchedule: EstimatedSchedule[]
    appStructure: string[]
    clientEmail: string
    businessObjectives: string
    projectDiscription: string
    constraints: string
    businessScope: string
    completionCriteria: string
    deliverables: Deliverable[]
    assumptions: string
    address: string
    zipCode: string
    clientCompany: string
    city: string
    createdAt: Timestamp
    status: string,
    latestUpdate: { update: string, id: string }[],
    remarks: { remark: string, id: string }[],
}

export interface EstimatedBudject {
    id: string
    resourceDiscription: string
    estdCost: string
}

export interface Procurement {
    discription: string
    id: string
    estdCost: string
    source: string
}

export interface HumanResourceRequriment {
    contact: string
    name: string
    department: string
    id: string
}

export interface EstimatedSchedule {
    projectMileStores: string
    time: string
    id: string
}

export interface Deliverable {
    deliverable: string
    id: string
}

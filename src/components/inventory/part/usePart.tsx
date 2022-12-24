import { useEffect, useState } from "react";
import { C_Part, PartData } from "../../../database/interfaces/Part";
import axios from 'axios'
import { useRouter } from 'next/router'
import { PartBank } from "../useInventory";

export interface PopulatedPart extends PartData {
    category: string;
}

interface PopulatedPartBank {
    [id:string]: PopulatedPart | PartBank[string];
}

interface LoadPartInfoProps {
    sessionPartData?: PopulatedPartBank;
    sessionProjectData?: {
        id: string;
        name: string;
    }[];
}

interface LoadPartResponseData {
    part: C_Part;
    projects?: {
        data: [string, string][];
    };
}

interface ProjectData {
    id: string;
    name: string;
}

export default function usePart() {

    const router = useRouter()

    const [part, setPart] = useState<PopulatedPart|null>(null)
    const [projects, setProjects] = useState<ProjectData[]>([])
    const [partName, setPartName] = useState('')
    const [error, setError] = useState(false)

    useEffect(() => {
        const id = router.query.id
        if (!(typeof(id) === 'string')) return

        const loadPartInfo = async ({sessionPartData, sessionProjectData}
            :LoadPartInfoProps) => {
            try {
                const {data} = await axios.get<LoadPartResponseData>(
                    `/api/inventory/part/${id}`, {
                        params: {
                            loadProjects: !Boolean(sessionProjectData)
                        },
                        retry: 3
                    }
                )
                console.log('data', data)

                if (!sessionProjectData && !data.projects) {
                    throw new Error('Failed to load projects')
                }

                const partData = {
                    ...data.part.data,
                    category: typeof(data.part.data.category) === 'string' ? 
                        data.part.data.category :
                        data.part.data.category['@ref'].id
                }

                if (sessionPartData) {
                    console.log('sessionPartData', sessionPartData)
                    sessionStorage.setItem('partData', JSON.stringify({
                        ...sessionPartData,
                        [data.part.ref['@ref'].id]: partData
                    }))
                } else {
                    sessionStorage.setItem('partData', JSON.stringify({
                        [data.part.ref['@ref'].id]: partData
                    }))
                }

                const projectsData = sessionProjectData || 
                    data.projects?.data.map(info => (
                        {id: info[0], name: info[1]}
                    ))
                if (!sessionProjectData) {
                    sessionStorage.setItem('projectIdAndNames', JSON.stringify(
                        projectsData
                    ))
                }

                if (!partName) {
                    setPartName(partData.name)
                }
                setPart(partData)
                setProjects(projectsData as ProjectData[])
            } catch (e) {
                console.log(e)
                setError(true)
            }
        }
        try {
            const partData = sessionStorage.getItem('partData') 
            const projectData = sessionStorage.getItem('projectIdAndNames')
            const parsedPartData = JSON.parse(partData || '{}')
            const parsedProjectData = JSON.parse(projectData || '{}')
            if (id in parsedPartData) {
                setPartName(parsedPartData[id].name)
            }
            if (projectData && 'available' in parsedPartData[id]) {
                console.log('using session storage')
                setProjects(parsedProjectData)
                setPart(parsedPartData[id])
                return
            }
            loadPartInfo({sessionPartData: partData ? parsedPartData : undefined, 
                sessionProjectData: projectData ? parsedProjectData : undefined})
            return
        } catch (e) {
            console.log(e)
        }
        loadPartInfo({})
    }, [])

    console.log('part', part)
    console.log('partName', partName)
    console.log('projects', projects)

    return {
        part, partName, error, projects
    }
}
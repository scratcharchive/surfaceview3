import { ChannelName, JSONStringifyDeterministic, TaskFunctionId, TaskFunctionType, TaskKwargs } from "kachery-js/types/kacheryTypes";
import { useCallback, useEffect, useMemo, useState } from "react";
import initiateTask, { Task } from "./initiateTask";
import useKacheryNode from "./useKacheryNode";

const useTask = <ReturnType>(functionId: TaskFunctionId | string | undefined, kwargs: TaskKwargs | {[key: string]: any}, functionType: TaskFunctionType, opts: {channelName?: ChannelName, queryUseCache?: boolean}) => {
    const [task, setTask] = useState<Task<ReturnType> | undefined>(undefined)
    const kacheryNode = useKacheryNode()
    const [, setUpdateCode] = useState<number>(0)
    const incrementUpdateCode = useCallback(() => {setUpdateCode(c => (c+1))}, [])
    const kwargsString = JSONStringifyDeterministic(kwargs)
    useEffect(() => {
        if (!opts.channelName) return
        if (!functionId) return
        let valid = true
        
        const kwargs2 = JSON.parse(kwargsString) as any as TaskKwargs

        const onStatusChanged = () => {
            if (!valid) return
            incrementUpdateCode()
        }

        const t = initiateTask<ReturnType>({
            kacheryNode,
            channelName: opts.channelName,
            functionId,
            kwargs: kwargs2,
            functionType,
            onStatusChanged,
            queryUseCache: opts.queryUseCache
        })
        
        setTask(t)

        return () => {
            valid = false
        }
    }, [functionId, kwargsString, functionType, opts.channelName, kacheryNode, incrementUpdateCode, opts.queryUseCache])
    const taskStatus = task ? task.status : undefined
    const returnValue = useMemo(() => {
        if (!task) return undefined
        return taskStatus === 'finished' ? task.result : undefined
    }, [task, taskStatus])
    return useMemo(() => ({
        returnValue,
        task
    }), [returnValue, task])
}

export default useTask
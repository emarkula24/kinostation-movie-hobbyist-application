import "./Groups.css"
import { useState, useEffect } from "react"
import axios from "axios"

const url = process.env.REACT_APP_API_URL

function Groups() {

    const [groups, setGroups] = useState([]);
    
    useEffect(() => {
        axios.get(url + "/groups")
            .then(response => {
            console.log(response.data)
            setGroups(response.data);
            }).catch(error => {
            alert(error.response.data.error ? error.response.data.error : error)
            })
        }, [])

    
    function handleGroupClick(group) {
        return;
    }

    return (
        <div class="group-list">
            <ul>
                {
                groups.map( group => (
                    <li key={group.group_id} onClick={() => handleGroupClick(group)}>
                        <h3>{group.group_name}</h3>
                    </li>
                ))
                }
            </ul>
            <div class ="button">
                <button type="button">Create group</button> 
            </div>
        </div>
    )

}

export default Groups;
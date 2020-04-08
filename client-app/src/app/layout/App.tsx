import React, { SyntheticEvent } from "react";
import { useState, useEffect, Fragment } from "react";
import { Container } from "semantic-ui-react";
import { IActivity } from "../models/activity";
import { NavBar } from "../../features/nav/NavBar";
import { ActivityDashboard } from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import { LoadingComponent } from "../layout/LoadingComponent";

const App = () => {
	const [activities, setActivities] = useState<IActivity[]>([]);
	const [selectActivity, setSelectActivity] = useState<IActivity | null>(null);
	const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // definimos una nueva propiedad. Esta contendra el nombre del boton que clickearemos
  const [target, setTarget] = useState('');

	const handleSelectActivity = (id: string) => {
		setSelectActivity(activities.filter(a => a.id === id)[0]);
		setEditMode(false);
	};

	const handleOpenCreateForm = () => {
		setSelectActivity(null);
		setEditMode(true);
	};

	const handleCreateActivity = (activity: IActivity) => {
    setSubmitting(true);
		agent.Activities.create(activity).then(() => {
			setActivities([...activities, activity]);
			setSelectActivity(activity);
			setEditMode(false);
    }).then(() => setSubmitting(false));
	};

	const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);
		agent.Activities.update(activity).then(() => {
			setActivities([
				...activities.filter(a => a.id !== activity.id),
				activity
			]);
			setSelectActivity(activity);
			setEditMode(false);
		}).then(() => setSubmitting(false));
	};

  // modificamos el handler para que reciba el evento al clickear el boton
	const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    setSubmitting(true);
    // seteamos el name del boton
    setTarget(event.currentTarget.name);
		agent.Activities.delete(id).then(() => {
			setActivities([...activities.filter(a => a.id !== id)]);
		}).then(() => setSubmitting(false));
	};

	useEffect(() => {
		agent.Activities.list()
			.then(response => {
				let activities: IActivity[] = [];
				response.forEach(activity => {
					activity.date = activity.date.split(".")[0];
					activities.push(activity);
				});
				setActivities(activities);
			})
			.then(() => setLoading(false));
	}, []);

	if (loading) return <LoadingComponent content="Loading activities..." />;

  // pasamos el target a activityDashboard
	return (
		<Fragment>
			<NavBar OpenCreateForm={handleOpenCreateForm} />
			<Container style={{ marginTop: "7em" }}>
				<ActivityDashboard
					activities={activities}
					selectActivity={handleSelectActivity}
					selectedActivity={selectActivity}
					editMode={editMode}
					setEditMode={setEditMode}
					setSelectedActivity={setSelectActivity}
					createActivity={handleCreateActivity}
					editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
          target={target}
				/>
			</Container>
		</Fragment>
	);
};

export default App;

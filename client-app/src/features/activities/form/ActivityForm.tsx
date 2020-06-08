import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";

interface FormRouteParams {
	id: string;
}

// agregamos la prop history para poder navegar entre las rutas
const ActivityForm: React.FC<RouteComponentProps<FormRouteParams>> = ( {match, history} ) => {
	const activityStore = useContext(ActivityStore);
	const {
		createActivity,
		editActivity,
		submitting,
		activity: initialFormState,
		loadActivity,
		clearActivity
	} = activityStore;
	
	// Movemos la declaracion de activity arriba de useEffect para poder hacer uso de ella en useEfect
	const [activity, setActivity] = useState<IActivity>({
		id: "",
		title: "",
		category: "",
		description: "",
		date: "",
		city: "",
		venue: ""
	});

	useEffect(() => {
		// Chekeamos si ya hay una actividad cargada para que no se ejecute al cerrarse el componente el loadActivity
		// y solo se ejecute el clearActivity (en el evento "componentWillUnmount")
		if(match.params.id && activity.id.length === 0){
			loadActivity(match.params.id).then(() => {
				initialFormState && setActivity(initialFormState);
			});
		}

		return () => {
			clearActivity();
		}
	}, [loadActivity, match.params.id, clearActivity, initialFormState, activity.id.length]); // agregamos activity.id.length como dependencia


	const handleOnChangeEvent = (
		event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.currentTarget;
		setActivity({ ...activity, [name]: value });
	};

	// agregamos redireccion luego de encargarnos del submit
	const handleSubmit = () => {
		if (activity.id.length === 0) {
			let newActivity = {
				...activity,
				id: uuid()
			};
			createActivity(newActivity).then(() => history.push(`/acivities/${newActivity.id}`));
		} else {
			editActivity(activity).then(() => history.push(`/activities/${activity.id}`));
		}
	};

	return (
		<Segment clearing>
			<Form onSubmit={handleSubmit}>
				<Form.Input
					name="title"
					onChange={handleOnChangeEvent}
					placeholder="Title"
					value={activity.title}
				/>
				<Form.TextArea
					name="description"
					onChange={handleOnChangeEvent}
					placeholder="Description"
					value={activity.description}
					rows={2}
				/>
				<Form.Input
					name="category"
					onChange={handleOnChangeEvent}
					placeholder="Category"
					value={activity.category}
				/>
				<Form.Input
					name="date"
					onChange={handleOnChangeEvent}
					type="datetime-local"
					placeholder="Date"
					value={activity.date}
				/>
				<Form.Input
					name="city"
					onChange={handleOnChangeEvent}
					placeholder="City"
					value={activity.city}
				/>
				<Form.Input
					name="venue"
					onChange={handleOnChangeEvent}
					placeholder="Venue"
					value={activity.venue}
				/>
				<Button
					loading={submitting}
					floated="right"
					positive
					type="submit"
					content="Submit"
				/>
				<Button
					onClick={() => activityStore.closeEditForm()}
					floated="right"
					type="button"
					content="Cancel"
				/>
			</Form>
		</Segment>
	);
};

export default observer(ActivityForm);

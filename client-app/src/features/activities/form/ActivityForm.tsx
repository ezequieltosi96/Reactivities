import React, { useState, FormEvent } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from 'uuid'

interface IProps {
	setEditMode: (editMode: boolean) => void;
	activity: IActivity | null;
	createActivity: (activity: IActivity) => void;
	editActivity: (activity: IActivity) => void;
	// Definimos la nueva prop
	submitting: boolean;
}

export const ActivityForm: React.FC<IProps> = ({ setEditMode, activity : initialFormState, createActivity, editActivity, submitting }) => {

	const initializeForm = () => {
		if (initialFormState) {
			return initialFormState;
		} else {
			return {
				id: "",
				title: "",
				category: "",
				description: "",
				date: "",
				city: "",
				venue: ""
			};
		}
	};

	const [activity, setActivity] = useState<IActivity> (initializeForm());

	const handleOnChangeEvent = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const {name, value} = event.currentTarget;
		setActivity({...activity, [name]: value});
	}

	const handleSubmit = () => {
		if(activity.id.length === 0){
			let newActivity = {
				...activity, id: uuid()
			}
			createActivity(newActivity);
		} else {
			editActivity(activity);
		}
	}

	// definimos la propiedad loading del boton submit
	return (
		<Segment clearing>
			<Form onSubmit={handleSubmit}>
				<Form.Input name="title" onChange={handleOnChangeEvent} placeholder="Title" value={activity.title} />
				<Form.TextArea name="description" onChange={handleOnChangeEvent} placeholder="Description" value={activity.description} rows={2}/>
				<Form.Input name="category" onChange={handleOnChangeEvent} placeholder="Category" value={activity.category} />
				<Form.Input name="date" onChange={handleOnChangeEvent} type="datetime-local" placeholder="Date" value={activity.date} />
				<Form.Input name="city" onChange={handleOnChangeEvent} placeholder="City" value={activity.city} />
				<Form.Input name="venue" onChange={handleOnChangeEvent} placeholder="Venue" value={activity.venue} />
				<Button loading={submitting} floated="right" positive type="submit" content="Submit" />
				<Button onClick={() => {setEditMode(false);}} floated="right" type="button" content="Cancel" />
			</Form>
		</Segment>
	);
};

import React, { SyntheticEvent } from "react";
import { IActivity } from "../../../app/models/activity";
import { Item, Button, Label, Segment } from "semantic-ui-react";

interface IProps {
	activities: IActivity[];
	selectActivity: (id: string) => void;
	// modificamos la firma del metodo
	deleteActivity: (e: SyntheticEvent<HTMLButtonElement>,id: string) => void;
	submitting: boolean;
	// Definimos la nueva prop
	target: string;
}

export const ActivityList: React.FC<IProps> = ({ activities, selectActivity, deleteActivity, submitting, target }) => {
	return (
		<Segment clearing>
			<Item.Group divided>
				{activities.map((activity: IActivity) => (
					<Item key={activity.id}>
						<Item.Content>
							<Item.Header as="a">{activity.title}</Item.Header>
							<Item.Meta>{activity.date}</Item.Meta>
							<Item.Description>
								<div>{activity.description}</div>
								<div>{activity.city}, {activity.venue}</div>
							</Item.Description>
							<Item.Extra>
								<Button onClick={() => {selectActivity(activity.id)}} floated="right" content="View" color="blue" />
								{ // damos nombre unico a nuestro boton y ademas pasamos el evento click a nuestro deleteHandler
								// si la proìedad target es igual al name del boton entonces tendra el indicador de carga
								}
								<Button 
									name={activity.id}
									loading={target === activity.id && submitting}
									onClick={(e) => {deleteActivity(e, activity.id)}} 
									floated="right" 
									content="Delete" 
									color="red" 
								/>
								<Label basic content={activity.category} />
							</Item.Extra>
						</Item.Content>
					</Item>
				))}
			</Item.Group>
		</Segment>
	);
};

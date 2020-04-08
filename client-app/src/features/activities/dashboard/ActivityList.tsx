import React from "react";
import { IActivity } from "../../../app/models/activity";
import { Item, Button, Label, Segment } from "semantic-ui-react";

interface IProps {
	activities: IActivity[];
	selectActivity: (id: string) => void;
	// Definimos la nueva prop
	deleteActivity: (id: string) => void;
}

export const ActivityList: React.FC<IProps> = ({ activities, selectActivity, deleteActivity }) => {
	// Agregamos el boton
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
								<div>
									{activity.city}, {activity.venue}
								</div>
							</Item.Description>
							<Item.Extra>
								<Button 
									onClick={() => {selectActivity(activity.id)}} 
									floated="right" 
									content="View" 
									color="blue" 
								/>
								<Button 
									onClick={() => {deleteActivity(activity.id)}} 
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

import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ActivityStore {
	@observable activityRegistry = new Map();
	@observable activity: IActivity | null = null;
	@observable loadingInitial: boolean = false;
	@observable editMode: boolean = false;
	@observable submitting: boolean = false;
	@observable target: string = "";

	@computed get activitiesByDate() {
		// Hacemos uso del helper method creado anteriormente
		return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
	}

	// creamos un helper method
	groupActivitiesByDate(activities: IActivity[]) {
		const sortedActivities = activities.sort(
			(a, b) => Date.parse(a.date) - Date.parse(b.date)
		);
		return Object.entries(sortedActivities.reduce((activities, activity) => {
			const date = activity.date.split('T')[0];
			activities[date] = activities[date] ? [...activities[date], activity] : [activity];
			return activities;
		}, {} as {[key: string]: IActivity[]}));
	}

	@action loadActivities = async () => {
		this.loadingInitial = true;
		try {
			let activities = await agent.Activities.list();
			runInAction(() => {
				activities.forEach(activity => {
					activity.date = activity.date.split(".")[0];
					this.activityRegistry.set(activity.id, activity);
				});
				this.loadingInitial = false;
			});
		} catch (error) {
			runInAction(() => {
				this.loadingInitial = false;
			});
			console.log(error);
		}
	};

	@action loadActivity = async (id: string) => {
		let activity = this.getActivity(id);
		if (activity) {
			this.activity = activity;
		} else {
			this.loadingInitial = true;
			try {
				activity = await agent.Activities.details(id);
				runInAction(() => {
					this.activity = activity;
					this.loadingInitial = false;
				});
			} catch (error) {
				runInAction(() => {
					this.activity = activity;
					this.loadingInitial = false;
				});
				console.log(error);
			}
		}
	};

	@action clearActivity = () => {
		this.activity = null;
	}

	getActivity = (id: string) => {
		return this.activityRegistry.get(id);
	};

	@action createActivity = async (activity: IActivity) => {
		this.submitting = true;
		try {
			await agent.Activities.create(activity);
			runInAction(() => {
				this.activityRegistry.set(activity.id, activity);
				this.editMode = false;
				this.submitting = false;
			});
		} catch (error) {
			runInAction(() => {
				this.submitting = false;
			});
			console.log(error);
		}
	};

	@action editActivity = async (activity: IActivity) => {
		this.submitting = true;
		try {
			await agent.Activities.update(activity);
			runInAction(() => {
				this.activityRegistry.set(activity.id, activity);
				this.activity = activity;
				this.editMode = false;
				this.submitting = false;
			});
		} catch (error) {
			runInAction(() => {
				this.submitting = false;
			});
			console.log(error);
		}
	};

	@action deleteActivity = async (
		event: SyntheticEvent<HTMLButtonElement>,
		id: string
	) => {
		this.submitting = true;
		this.target = event.currentTarget.name;
		try {
			await agent.Activities.delete(id);
			runInAction(() => {
				this.activityRegistry.delete(id);
				this.submitting = false;
				this.target = "";
			});
		} catch (error) {
			runInAction(() => {
				this.submitting = false;
				this.target = "";
			});

			console.log(error);
		}
	};

	@action openCreateForm = () => {
		this.editMode = true;
		this.activity = null;
	};

	@action openEditForm = (id: string) => {
		this.activity = this.activityRegistry.get(id);
		this.editMode = true;
	};

	@action closeEditForm = () => {
		this.editMode = false;
	};

	@action cancelSelectedActivity = () => {
		this.activity = null;
	};

	@action selectActivity = (id: string) => {
		this.activity = this.activityRegistry.get(id);
		this.editMode = false;
	};
}

export default createContext(new ActivityStore());

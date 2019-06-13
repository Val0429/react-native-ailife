import { Subject } from 'rxjs';
import frs, {RecognizedUser, UnRecognizedUser, UserType, Gender, Demographic} from './../services/frs-service';

export type RecognizedDemographicUser = RecognizedUser & Demographic;
export type UnRecognizedDemographicUser = UnRecognizedUser & Demographic;

export const sjUserDemographic = new Subject<RecognizedDemographicUser | UnRecognizedDemographicUser>();

export const sjWorkflowFinished = new Subject<boolean>();
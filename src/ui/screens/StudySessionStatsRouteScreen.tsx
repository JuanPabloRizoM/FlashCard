import { useEffect } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useStudyFlow } from '../../features/study/StudyFlowProvider';
import type { StudyStackParamList } from '../../navigation/types';
import { StudySessionStatsScreen } from '../components/study/StudySessionStatsScreen';

type StudySessionStatsRouteScreenProps = NativeStackScreenProps<StudyStackParamList, 'StudySessionStats'>;

export function StudySessionStatsRouteScreen({ navigation, route }: StudySessionStatsRouteScreenProps) {
  const { selectedSessionDetail, isLoadingSessionDetail, onCloseSessionDetail, onOpenSessionDetail } = useStudyFlow();

  useEffect(() => {
    void onOpenSessionDetail(route.params.sessionId);
  }, [onOpenSessionDetail, route.params.sessionId]);

  return (
    <StudySessionStatsScreen
      detail={selectedSessionDetail}
      isLoading={isLoadingSessionDetail}
      onBack={() => {
        onCloseSessionDetail();
        navigation.goBack();
      }}
    />
  );
}

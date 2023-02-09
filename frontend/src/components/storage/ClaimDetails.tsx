import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import PersistentVolumeClaim from '../../lib/k8s/persistentVolumeClaim';
import { EventsSection } from '../cluster/Overview';
import { StatusLabel } from '../common/Label';
import { DetailsGrid } from '../common/Resource';

export default function VolumeClaimDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { t } = useTranslation('glossary');

  function makeStatusLabel(item: PersistentVolumeClaim) {
    const status = item.status!.phase;
    return <StatusLabel status={status === 'Bound' ? 'success' : 'error'}>{status}</StatusLabel>;
  }

  return (
    <DetailsGrid
      resourceType={PersistentVolumeClaim}
      name={name}
      namespace={namespace}
      extraInfo={item =>
        item && [
          {
            name: t('Status'),
            value: makeStatusLabel(item),
          },
          {
            name: t('Capacity'),
            value: item.spec!.resources.requests.storage,
          },
          {
            name: t('Access Modes'),
            value: item.spec!.accessModes.join(', '),
          },
          {
            name: t('Volume Mode'),
            value: item.spec!.volumeMode,
          },
          {
            name: t('Storage Class'),
            value: item.spec!.storageClassName,
          },
        ]
      }
      sectionsFunc={item => item && <EventsSection />}
    />
  );
}

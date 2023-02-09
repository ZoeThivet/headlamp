import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import PersistentVolume from '../../lib/k8s/persistentVolume';
import { EventsSection } from '../cluster/Overview';
import { StatusLabel } from '../common/Label';
import { DetailsGrid } from '../common/Resource';

export default function VolumeDetails() {
  const { name } = useParams<{ namespace: string; name: string }>();
  const { t } = useTranslation('glossary');

  function makeStatusLabel(item: PersistentVolume) {
    const status = item.status!.phase;
    return <StatusLabel status={status === 'Bound' ? 'success' : 'error'}>{status}</StatusLabel>;
  }

  return (
    <DetailsGrid
      resourceType={PersistentVolume}
      name={name}
      extraInfo={item =>
        item && [
          {
            name: t('Status'),
            value: makeStatusLabel(item),
          },
          {
            name: t('Capacity'),
            value: item.spec!.capacity.storage,
          },
          {
            name: t('Access Modes'),
            value: item.spec!.accessModes.join(', '),
          },
          {
            name: t('Reclaim Policy'),
            value: item.spec!.persistentVolumeReclaimPolicy,
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

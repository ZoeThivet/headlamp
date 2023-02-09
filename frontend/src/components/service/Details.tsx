import { InlineIcon } from '@iconify/react';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Endpoints from '../../lib/k8s/endpoints';
import Service from '../../lib/k8s/service';
import { EventsSection } from '../cluster/Overview';
import { Link } from '../common';
import Empty from '../common/EmptyContent';
import { ValueLabel } from '../common/Label';
import { DetailsGrid, MetadataDictGrid } from '../common/Resource';
import PortForward from '../common/Resource/PortForward';
import { SectionBox } from '../common/SectionBox';
import SimpleTable from '../common/SimpleTable';

export default function ServiceDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { t } = useTranslation(['glossary', 'frequent']);

  const [endpoints, endpointsError] = Endpoints.useList({ namespace });

  function getOwnedEndpoints(item: Service) {
    return item ? endpoints?.filter(endpoint => endpoint.getName() === item.getName()) : null;
  }

  return (
    <DetailsGrid
      resourceType={Service}
      name={name}
      namespace={namespace}
      extraInfo={item =>
        item && [
          {
            name: t('Type'),
            value: item.spec.type,
          },
          {
            name: t('Cluster IP'),
            value: item.spec.clusterIP,
          },
          {
            name: t('External IP'),
            value: item.getExternalAddresses(),
            hide: _.isEmpty,
          },
          {
            name: t('Selector'),
            value: <MetadataDictGrid dict={item.spec.selector} />,
          },
        ]
      }
      sectionsFunc={item =>
        item && (
          <>
            <SectionBox title={t('Ports')}>
              <SimpleTable
                data={item.spec.ports}
                columns={[
                  {
                    label: t('Protocol'),
                    datum: 'protocol',
                  },
                  {
                    label: t('frequent|Name'),
                    datum: 'name',
                  },
                  {
                    label: t('Ports'),
                    getter: ({ port, targetPort }) => (
                      <React.Fragment>
                        <ValueLabel>{port}</ValueLabel>
                        <InlineIcon icon="mdi:chevron-right" />
                        <ValueLabel>{targetPort}</ValueLabel>
                        <PortForward containerPort={targetPort} resource={item} />
                      </React.Fragment>
                    ),
                  },
                ]}
                reflectInURL="ports"
              />
            </SectionBox>
            <SectionBox title={t('Endpoints')}>
              {endpointsError ? (
                <Empty color="error">{endpointsError}</Empty>
              ) : (
                <SimpleTable
                  data={getOwnedEndpoints(item)}
                  columns={[
                    {
                      label: t('frequent|Name'),
                      getter: endpoint => <Link kubeObject={endpoint} />,
                    },
                    {
                      label: t('frequent|Addresses'),
                      getter: endpoint => endpoint.getAddressesText(),
                      cellProps: { style: { width: '40%', maxWidth: '40%' } },
                    },
                  ]}
                  reflectInURL="endpoints"
                />
              )}
            </SectionBox>
            <EventsSection />
          </>
        )
      }
    />
  );
}

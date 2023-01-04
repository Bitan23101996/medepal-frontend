import { PeerConsultingRoutingModule } from './peer-consulting-routing.module';

describe('PeerConsultingRoutingModule', () => {
  let peerConsultingRoutingModule: PeerConsultingRoutingModule;

  beforeEach(() => {
    peerConsultingRoutingModule = new PeerConsultingRoutingModule();
  });

  it('should create an instance', () => {
    expect(peerConsultingRoutingModule).toBeTruthy();
  });
});

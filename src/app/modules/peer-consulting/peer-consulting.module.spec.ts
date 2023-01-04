import { PeerConsultingModule } from './peer-consulting.module';

describe('PeerConsultingModule', () => {
  let peerConsultingModule: PeerConsultingModule;

  beforeEach(() => {
    peerConsultingModule = new PeerConsultingModule();
  });

  it('should create an instance', () => {
    expect(peerConsultingModule).toBeTruthy();
  });
});

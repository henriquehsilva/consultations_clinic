import ConsultationService from '../services/consultation.service';

test('Should created a consultation', () => {
    let consultation = {
        date: '08/08/2023',
        time: '10:00',
        specialty: 'Cardiologia',
        userId: 1
    }

    const createConsultation = ConsultationService.create(1, consultation);

    expect(createConsultation).toHaveProperty('_id');
});
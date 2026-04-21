export interface NigerianState {
  id: string;
  name: string;
  code: string;
  capital: string;
  region: string;
}

export interface AddressSuggestion {
  id: string;
  fullAddress: string;
  street: string;
  city: string;
  state: string;
}

class LocationApiService {
  /**
   * Get all 36 states + FCT in Nigeria
   */
  getAllStates(): NigerianState[] {
    return [
      // North Central
      { id: '1', name: 'Abuja', code: 'FCT', capital: 'Abuja', region: 'North Central' },
      { id: '2', name: 'Benue', code: 'BN', capital: 'Makurdi', region: 'North Central' },
      { id: '3', name: 'Kogi', code: 'KG', capital: 'Lokoja', region: 'North Central' },
      { id: '4', name: 'Kwara', code: 'KW', capital: 'Ilorin', region: 'North Central' },
      { id: '5', name: 'Nasarawa', code: 'NS', capital: 'Keffi', region: 'North Central' },
      { id: '6', name: 'Niger', code: 'NG', capital: 'Minna', region: 'North Central' },
      { id: '7', name: 'Plateau', code: 'PL', capital: 'Jos', region: 'North Central' },
      
      // North East
      { id: '8', name: 'Adamawa', code: 'AD', capital: 'Yola', region: 'North East' },
      { id: '9', name: 'Bauchi', code: 'BA', capital: 'Bauchi', region: 'North East' },
      { id: '10', name: 'Borno', code: 'BO', capital: 'Maiduguri', region: 'North East' },
      { id: '11', name: 'Gombe', code: 'GM', capital: 'Gombe', region: 'North East' },
      { id: '12', name: 'Taraba', code: 'TR', capital: 'Jalingo', region: 'North East' },
      { id: '13', name: 'Yobe', code: 'YE', capital: 'Damaturu', region: 'North East' },
      
      // North West
      { id: '14', name: 'Kaduna', code: 'KD', capital: 'Kaduna', region: 'North West' },
      { id: '15', name: 'Kano', code: 'KN', capital: 'Kano', region: 'North West' },
      { id: '16', name: 'Katsina', code: 'KT', capital: 'Katsina', region: 'North West' },
      { id: '17', name: 'Kebbi', code: 'KB', capital: 'Birnin Kebbi', region: 'North West' },
      { id: '18', name: 'Sokoto', code: 'SO', capital: 'Sokoto', region: 'North West' },
      { id: '19', name: 'Zamfara', code: 'ZM', capital: 'Gusau', region: 'North West' },
      { id: '20', name: 'Jigawa', code: 'JG', capital: 'Dutse', region: 'North West' },
      
      // South East
      { id: '21', name: 'Abia', code: 'AB', capital: 'Umuahia', region: 'South East' },
      { id: '22', name: 'Anambra', code: 'AN', capital: 'Awka', region: 'South East' },
      { id: '23', name: 'Ebonyi', code: 'EB', capital: 'Abakaliki', region: 'South East' },
      { id: '24', name: 'Enugu', code: 'EN', capital: 'Enugu', region: 'South East' },
      { id: '25', name: 'Imo', code: 'IM', capital: 'Owerri', region: 'South East' },
      
      // South South
      { id: '26', name: 'Akwa Ibom', code: 'AK', capital: 'Uyo', region: 'South South' },
      { id: '27', name: 'Bayelsa', code: 'BY', capital: 'Yenagoa', region: 'South South' },
      { id: '28', name: 'Cross River', code: 'CR', capital: 'Calabar', region: 'South South' },
      { id: '29', name: 'Delta', code: 'DT', capital: 'Asaba', region: 'South South' },
      { id: '30', name: 'Edo', code: 'ED', capital: 'Benin City', region: 'South South' },
      { id: '31', name: 'Rivers', code: 'RV', capital: 'Port Harcourt', region: 'South South' },
      
      // South West
      { id: '32', name: 'Ekiti', code: 'EK', capital: 'Ado Ekiti', region: 'South West' },
      { id: '33', name: 'Lagos', code: 'LG', capital: 'Ikeja', region: 'South West' },
      { id: '34', name: 'Ogun', code: 'OG', capital: 'Abeokuta', region: 'South West' },
      { id: '35', name: 'Ondo', code: 'OD', capital: 'Akure', region: 'South West' },
      { id: '36', name: 'Osun', code: 'OS', capital: 'Osogbo', region: 'South West' },
      { id: '37', name: 'Oyo', code: 'OY', capital: 'Ibadan', region: 'South West' }
    ];
  }

  /**
   * Get cities for a specific state
   */
  getCitiesByState(stateName: string): string[] {
    const stateCities: Record<string, string[]> = {
      'Abuja': [
        'Abuja', 'Maitama', 'Asokoro', 'Wuse', 'Garki', 'Jabi', 'Utako', 'Life Camp', 
        'Dawaki', 'Karu', 'Kubwa', 'Bwari', 'Gwagwalada', 'Airport Road', 'Central Area',
        'Wuse 2', 'Wuse Zone 7', 'Gwarinpa', 'Jekko', 'Kado', 'Dei Dei', 'Zuba', 'Karmo'
      ],
      'Lagos': [
        'Ikeja', 'Victoria Island', 'Lekki', 'Ikoyi', 'Yaba', 'Surulere', 'Ajah', 'Maryland',
        'Gbagada', 'Alimosho', 'Ajeromi-Ifelodun', 'Kosofe', 'Mushin', 'Oshodi-Isolo',
        'Ojo', 'Ikorodu', 'Agege', 'Ifako-Ijaiye', 'Shomolu', 'Amuwo-Odofin',
        'Lagos Mainland', 'Lagos Island', 'Eti Osa', 'Ibeju-Lekki', 'Badagry',
        'Epe', 'Apapa', 'Oshodi', 'Isolo', 'Ejigbo', 'Magodo', 'Omole', 'Ogba',
        'Ilupeju', 'Palmgrove', 'Anthony', 'Ojota', 'Ketu', 'Alapere', 'Berger'
      ],
      'Rivers': [
        'Port Harcourt', 'Obio Akpor', 'Bonny', 'Degema', 'Eleme', 'Emohua',
        'Etche', 'Gokana', 'Ikwerre', 'Khana', 'Ogba Egbema Ndoni',
        'Oyigbo', 'Tai', 'Andoni', 'Asari Toru', 'Akuku Toru'
      ],
      'Kano': [
        'Kano', 'Kano Municipal', 'Dala', 'Gwale', 'Gwarzo', 'Kunchi', 'Madobi',
        'Minjibir', 'Nasarawa', 'Rano', 'Rimin Gado', 'Rogo', 'Shanono', 'Takai',
        'Tarauni', 'Tofa', 'Tsanyawa', 'Ungogo', 'Warawa', 'Dawakin Kudu',
        'Dawakin Tofa', 'Bagwai', 'Bebeji', 'Bichi', 'Bunkure', 'Dala', 'Danbatta'
      ],
      'Oyo': [
        'Ibadan', 'Oyo', 'Ogbomoso', 'Iseyin', 'Saki', 'Iseyin', 'Oyo', 'Ibadan',
        'Ibarapa', 'Ibadan North', 'Ibadan North East', 'Ibadan North West',
        'Ibadan South East', 'Ibadan South West', 'Irepo', 'Iseyin', 'Itesiwaju',
        'Iwajowa', 'Kajola', 'Lagelu', 'Ogo Oluwa', 'Ogbomosho North', 'Ogbomosho South',
        'Olorunsogo', 'Oluyole', 'Ona Ara', 'Orelope', 'Oyo East', 'Oyo West',
        'Saki East', 'Saki West', 'Surulere', 'Egbeda', 'Akinyele', 'Atiba'
      ],
      'Kaduna': [
        'Kaduna', 'Zaria', 'Kafanchan', 'Kagoro', 'Kachia', 'Zangon Kataf', 'Samaru',
        'Birnin Gwari', 'Giwa', 'Ikara', 'Igabi', 'Jaba', 'Jema a', 'Kachia',
        'Kaduna North', 'Kaduna South', 'Kagarko', 'Kajuru', 'Kauru', 'Kwoi',
        'Lere', 'Makarfi', 'Sabon Gari', 'Sanga', 'Soba', 'Zangon Kataf', 'Zaria'
      ],
      'Enugu': [
        'Enugu', 'Nsukka', 'Agbani', 'Udi', 'Oji River', 'Awgu', 'Aninri', 'Ezeagu',
        'Igbo Eze North', 'Igbo Eze South', 'Isi Uzo', 'Nkanu East', 'Nkanu West',
        'Nsukka', 'Udenu', 'Uzo Uwani', 'Enugu North', 'Enugu South', 'Enugu East',
        'Igbo Eze North', 'Igbo Eze South', 'Isi Uzo', 'Nkanu East', 'Nkanu West'
      ],
      'Edo': [
        'Benin City', 'Auchi', 'Uromi', 'Ekpoma', 'Irrua', 'Sabongida Ora',
        'Igarra', 'Auchi', 'Benin City', 'Ehor', 'Ekpoma', 'Esan', 'Ewu',
        'Fugar', 'Igarra', 'Ikeken', 'Irrua', 'Jattu', 'Okada', 'Okpella',
        'Ologbo', 'Ora', 'Oria', 'Sabongida Ora', 'Ubiaja', 'Ugbekun', 'Ugoneki'
      ],
      'Delta': [
        'Asaba', 'Warri', 'Sapele', 'Ughelli', 'Agbor', 'Oghara', 'Kwale', 'Burutu',
        'Issele Uku', 'Ozoro', 'Owa', 'Abavo', 'Adonte', 'Agbarho', 'Agbor',
        'Akukwu Igbo', 'Alisimie', 'Ashaka', 'Beneku', 'Bomadi',
        'Burutu', 'Eku', 'Ekpan', 'Ekpe', 'Ekreke', 'Evwreni', 'Ewu', 'Effurun'
      ],
      'Ogun': [
        'Abeokuta', 'Ijebu Ode', 'Sagamu', 'Ifo', 'Ota', 'Iperu', 'Ilaro', 'Shagamu',
        'Owode', 'Ijebu Igbo', 'Ago Iwoye', 'Remo', 'Ikenne', 'Iperu', 'Ilisan',
        'Oru', 'Imeko Afon', 'Ipokia', 'Ado Odo Ota', 'Ewekoro', 'Obafemi Owode',
        'Odeda', 'Odogbolu', 'Yewa North', 'Yewa South', 'Abeokuta North',
        'Abeokuta South', 'Ijebu East', 'Ijebu North', 'Ijebu North East', 'Ijebu Ode'
      ],
      'Ondo': [
        'Akure', 'Ondo', 'Owo', 'Akoko', 'Okitipupa', 'Idanre', 'Ifedore', 'Ile Oluji',
        'Odigbo', 'Ose', 'Owo', 'Akure North', 'Akure South', 'Akoko South East',
        'Akoko South West', 'Akoko North East', 'Akoko North West', 'Idanre',
        'Ifedore', 'Ile Oluji Okeigbo', 'Irele', 'Odigbo', 'Okitipupa', 'Ondo West'
      ],
      'Imo': [
        'Owerri', 'Orlu', 'Okigwe', 'Aboh Mbaise', 'Ahiazu Mbaise', 'Ehime Mbano',
        'Ezinihitte Mbaise', 'Ideato North', 'Ideato South', 'Ihitte Uboma', 'Ikeduru',
        'Isiala Mbano', 'Isu', 'Mbaitoli', 'Ngor Okpala', 'Njaba', 'Nwangele',
        'Nkwerre', 'Obowo', 'Oguta', 'Ohaji Egbema', 'Okigwe', 'Onuimo', 'Orlu',
        'Orsu', 'Oru East', 'Oru West', 'Owerri Municipal', 'Owerri North', 'Owerri West'
      ],
      'Akwa Ibom': [
        'Uyo', 'Eket', 'Ikot Ekpene', 'Abak', 'Oron', 'Ikot Abasi', 'Itu', 'Essien Udim',
        'Ibiono Ibom', 'Ika', 'Ini', 'Mbo', 'Nsit Atai', 'Nsit Ibom', 'Nsit Ubium',
        'Obot Akara', 'Okobo', 'Onna', 'Oruk Anam', 'Udung Uko', 'Ukanafun',
        'Uruan', 'Urue Offong Oruko', 'Uyo', 'Ibeno', 'Eastern Obolo', 'Etinan'
      ],
      'Cross River': [
        'Calabar', 'Ogoja', 'Ikom', 'Obudu', 'Ugep', 'Akamkpa', 'Akpabuyo',
        'Bakassi', 'Bete', 'Biase', 'Boki', 'Calabar Municipal', 'Calabar South',
        'Etung', 'Ikom', 'Obanliku', 'Obubra', 'Obudu', 'Odukpani', 'Ogoja',
        'Yakuur', 'Yala', 'Abi', 'Akamkpa', 'Akpabuyo', 'Bakassi', 'Bete'
      ],
      'Anambra': [
        'Awka', 'Onitsha', 'Nnewi', 'Ekwulobia', 'Aguata', 'Anambra East', 'Anambra West',
        'Anaocha', 'Awka North', 'Awka South', 'Ayamelum', 'Dunukofia', 'Ekwusigo',
        'Idemili North', 'Idemili South', 'Ihiala', 'Njikoka', 'Nnewi North', 'Nnewi South',
        'Ogbaru', 'Ogba', 'Onitsha North', 'Onitsha South', 'Orumba North', 'Orumba South'
      ],
      'Abia': [
        'Umuahia', 'Aba', 'Arochukwu', 'Bende', 'Ikwuano', 'Isiala Ngwa North',
        'Isiala Ngwa South', 'Isiukwuato', 'Nneato', 'Ohafia', 'Obi Ngwa', 'Osisioma',
        'Umuahia North', 'Umuahia South', 'Ukwa East', 'Ukwa West', 'Umunneochi',
        'Aba North', 'Aba South', 'Arochukwu', 'Bende', 'Ikwuano', 'Isiala Ngwa'
      ]
    };
    
    const cities = stateCities[stateName] || [];
    return [...new Set(cities)].sort();
  }

  /**
   * Get address suggestions
   */
  getAddressSuggestions(query: string, city?: string, state?: string): AddressSuggestion[] {
    if (!query || query.length < 2) return [];

    let stateAddresses: string[] = [];
    if (state) {
      stateAddresses = this.getCitiesByState(state);
    } else {
      stateAddresses = [
        'Ikeja', 'Victoria Island', 'Lekki', 'Ikoyi', 'Yaba',
        'Ikeja GRA', 'Lekki Phase 1', 'Lekki Phase 2', 'Banana Island', 'VGC',
        'Maitama', 'Asokoro', 'Wuse', 'Garki', 'Jabi',
        'Kubwa', 'Bwari', 'Gwagwalada', 'Airport Road', 'Central Area',
        'Ibadan', 'Bodija', 'Mokola', 'Agodi', 'Dugbe',
        'Challenge', 'Ring Road', 'Samonda', 'Agbowo', 'UI',
        'Kano', 'Nasarawa', 'Fagge', 'Dala', 'Gwale',
        'Sabon Gari', 'Tarauni', 'Ungogo', 'Kumbotso',
        'Port Harcourt', 'Obio-Akpor', 'Eleme', 'Oyigbo',
        'Bonny', 'Okrika', 'Degema', 'Andoni', 'Khana'
      ];
    }
    
    const allOptions = [...new Set([...stateAddresses])];
    const queryLower = query.toLowerCase().trim();
    const filtered = allOptions.filter(option => 
      option.toLowerCase().includes(queryLower)
    );
    
    const sorted = filtered.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      const aExact = aLower === queryLower || aLower.startsWith(queryLower);
      const bExact = bLower === queryLower || bLower.startsWith(queryLower);
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return a.localeCompare(b);
    });
    
    const displayCity = city || 'Unknown';
    const displayState = state || 'Unknown';
    
    return sorted.slice(0, 10).map((name, index) => ({
      id: `fallback-${index}-${Date.now()}`,
      fullAddress: `${name}, ${displayCity}, ${displayState}`,
      street: name,
      city: displayCity,
      state: displayState
    }));
  }
}

export const locationApiService = new LocationApiService();

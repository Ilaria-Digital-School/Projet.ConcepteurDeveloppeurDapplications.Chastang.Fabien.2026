export class Countries {
    other = { value: 0, label: "– Autre –" };
    list = [
        { value: 1, label: "Allemagne" },
        { value: 2, label: "Autriche" },
        { value: 3, label: "Belgique" },
        { value: 4, label: "Brésil" },
        { value: 5, label: "Canada" },
        { value: 6, label: "Chine" },
        { value: 7, label: "Espagne" },
        { value: 8, label: "États-Unis" },
        { value: 9, label: "France" },
        { value: 10, label: "Grèce" },
        { value: 11, label: "Inde" },
        { value: 12, label: "Italie" },
        { value: 13, label: "Japon" },
        { value: 14, label: "Luxembourg" },
        { value: 15, label: "Mauritanie" },
        { value: 16, label: "Mexique" },
        { value: 17, label: "Portugal" },
        { value: 18, label: "Royaume-Uni" },
        { value: 19, label: "Sénégal" },
        { value: 20, label: "Suisse" },
        { value: 21, label: "Taïwan" },
        { value: 22, label: "Tunisie" },
        this.other
    ];

    // Get the ID from the name and the name from the ID
    getId(countryName:string) {
        const COUNTRY = this.list.find(item => item.label.toLowerCase() == countryName);
        return (COUNTRY) ? COUNTRY.value : this.other.value;
    }
    getName(countryId:number) {
        const COUNTRY = this.list.find(item => item.value == countryId);
        return (COUNTRY) ? COUNTRY.label : this.other.label;
    }
}